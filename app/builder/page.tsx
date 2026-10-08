"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Brand } from "../../components/shell";
import { Icon } from "../../components/icon";
import { DocumentPreview } from "../../components/document-preview";
import { createClient } from "../../lib/supabase/client";
import {
  type Content,
  type VitaDocument,
  type Entry,
  newEntry,
  newDocument,
  localDocuments,
  saveLocal,
  parseDocument,
  templates,
  findTemplate,
  isLetter,
  checks,
  downloadBackup,
  sampleContent,
} from "../../lib/documents";
const signature = (d: VitaDocument) =>
  JSON.stringify([d.title, d.content, d.document_type]);
export default function Builder() {
  const [doc, setDoc] = useState<VitaDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [cloud, setCloud] = useState(false);
  const [owner, setOwner] = useState<string | null>(null);
  const [version, setVersion] = useState("");
  const [saved, setSaved] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [active, setActive] = useState("details");
  const [preview, setPreview] = useState(false);
  const [localFailed, setLocalFailed] = useState(false);
  const [printHelp, setPrintHelp] = useState(false);
  const loaded = useRef(false);
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const q = new URLSearchParams(location.search);
        const id = q.get("id");
        const fromCloud = q.get("storage") === "cloud";
        let initial: VitaDocument;
        if (id && fromCloud) {
          const client = createClient();
          const {
            data: { user },
            error: authError,
          } = await client.auth.getUser();
          if (authError || !user)
            throw new Error("Please sign in to open this account document.");
          const { data, error } = await client
            .from("documents")
            .select("*")
            .eq("id", id)
            .eq("user_id", user.id)
            .single();
          if (error)
            throw new Error(
              "This document could not be opened. It may have been deleted or belong to another account.",
            );
          initial = parseDocument(data);
          if (alive) {
            setCloud(true);
            setOwner(user.id);
            setVersion(data.updated_at);
            setSaved(signature(initial));
            setStatus("Saved to your account");
          }
        } else if (id) {
          const local = localDocuments().find((d) => d.id === id);
          if (!local)
            throw new Error(
              "This browser draft was not found. Open My documents to choose another.",
            );
          initial = local;
        } else {
          initial = newDocument(q.get("template") || "essential");
          try {
            saveLocal(initial);
          } catch {}
          window.history.replaceState(
            null,
            "",
            `${location.pathname}?id=${initial.id}`,
          );
        }
        if (alive) {
          setDoc(initial);
          loaded.current = true;
        }
      } catch (e) {
        if (alive)
          setError(e instanceof Error ? e.message : "Unable to open document.");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);
  useEffect(() => {
    if (!doc || !loaded.current || cloud) return;
    try {
      saveLocal(doc);
      setStatus("Saved in this browser");
      setLocalFailed(false);
    } catch {
      setStatus("Browser save unavailable");
      setLocalFailed(true);
    }
  }, [doc, cloud]);
  const dirty = !!doc && cloud && signature(doc) !== saved;
  useEffect(() => {
    if (!dirty && !localFailed) return;
    const protect = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", protect);
    return () => window.removeEventListener("beforeunload", protect);
  }, [dirty, localFailed]);
  useEffect(() => {
    if (!cloud) return;
    const { data } = createClient().auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || (session && session.user.id !== owner)) {
        setDoc(null);
        setError(
          "Your session changed. Sign in to reopen this account document.",
        );
      }
    });
    return () => data.subscription.unsubscribe();
  }, [cloud, owner]);
  function editContent<K extends keyof Content>(key: K, value: Content[K]) {
    setDoc((d) =>
      d
        ? {
            ...d,
            content: { ...d.content, [key]: value },
            updated_at: new Date().toISOString(),
          }
        : d,
    );
  }
  function field(
    key: keyof Content,
    label: string,
    placeholder = "",
    long = false,
    hint = "",
  ) {
    return (
      <label className={long ? "wide" : ""}>
        {label}
        {long ? (
          <textarea
            value={String(doc!.content[key])}
            maxLength={12000}
            placeholder={placeholder}
            rows={key === "body" ? 15 : 5}
            onChange={(e) => editContent(key, e.target.value as never)}
          />
        ) : (
          <input
            type={key === "email" ? "email" : "text"}
            maxLength={key === "name" ? 120 : 500}
            value={String(doc!.content[key])}
            placeholder={placeholder}
            onChange={(e) => editContent(key, e.target.value as never)}
          />
        )}{" "}
        {hint && <small>{hint}</small>}
      </label>
    );
  }
  async function saveCloud() {
    if (!doc || busy) return;
    setBusy(true);
    setError("");
    const snapshot = doc;
    try {
      const client = createClient();
      const {
        data: { user },
        error: authError,
      } = await client.auth.getUser();
      if (authError || !user)
        throw new Error(
          "Sign in first, then reopen this browser draft from My documents and choose Save to account.",
        );
      if (cloud && owner !== user.id)
        throw new Error(
          "This document belongs to a different signed-in account.",
        );
      const payload = {
        title: snapshot.title.trim() || "Untitled document",
        document_type: snapshot.document_type,
        content: snapshot.content,
      };
      const result = cloud
        ? await client
            .from("documents")
            .update(payload)
            .eq("id", snapshot.id)
            .eq("user_id", user.id)
            .eq("updated_at", version)
            .select("updated_at")
            .maybeSingle()
        : await client
            .from("documents")
            .insert({ ...payload, id: snapshot.id, user_id: user.id })
            .select("updated_at")
            .single();
      if (result.error) throw result.error;
      if (!result.data)
        throw new Error(
          "This document changed in another tab. Export a backup of your edits, then reload before saving again.",
        );
      setCloud(true);
      setOwner(user.id);
      setVersion(result.data.updated_at);
      setSaved(signature(snapshot));
      setStatus("Saved to your account");
      window.history.replaceState(
        null,
        "",
        `${location.pathname}?id=${snapshot.id}&storage=cloud`,
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Unable to save. Export a backup to keep your changes.",
      );
    } finally {
      setBusy(false);
    }
  }
  function goBack(e: React.MouseEvent) {
    if (
      dirty &&
      !confirm("You have unsaved account changes. Leave without saving?")
    )
      e.preventDefault();
  }
  if (loading)
    return (
      <main className="loading-page">
        <Brand />
        <p>Opening your workspace…</p>
      </main>
    );
  if (!doc)
    return (
      <main className="loading-page">
        <Brand />
        <h1>Let’s get you back to your documents.</h1>
        <p role="alert">{error}</p>
        <Link className="button" href="/dashboard">
          My documents
        </Link>
        <Link href="/login" className="text-link">
          Sign in
        </Link>
      </main>
    );
  const c = doc.content;
  const letter = isLetter(doc.document_type);
  const checklist = checks(doc);
  const done = checklist.filter((x) => x.done).length;
  const steps = letter
    ? [
        ["details", "Your details"],
        ["letter", "Your letter"],
        ["design", "Design"],
        ["review", "Review & export"],
      ]
    : [
        ["details", "Personal details"],
        ["experience", "Experience"],
        ["education", "Education"],
        ["more", "Skills & more"],
        ["design", "Design"],
        ["review", "Review & export"],
      ];
  function repeat(
    section: "experience" | "education" | "projects" | "volunteering",
    label: string,
  ) {
    return (
      <div className="entry-list">
        <div className="entry-list-heading">
          <h3>{label}</h3>
          <span>{c[section].length} entries</span>
        </div>
        {c[section].map((entry, index) => (
          <fieldset className="entry-card" key={entry.id}>
            <legend>
              {label} {index + 1}
            </legend>
            <div className="entry-tools">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => {
                  const values = [...c[section]];
                  [values[index - 1], values[index]] = [
                    values[index],
                    values[index - 1],
                  ];
                  editContent(section, values);
                }}
              >
                Move up
              </button>
              <button
                type="button"
                className="danger-text"
                onClick={() => {
                  if (confirm("Remove this entry?"))
                    editContent(
                      section,
                      c[section].filter((_, i) => i !== index),
                    );
                }}
              >
                Remove
              </button>
            </div>
            <div className="form-grid">
              {(
                [
                  "title",
                  "organization",
                  "location",
                  "dates",
                  "details",
                ] as (keyof Entry)[]
              ).map((key) => (
                <label className={key === "details" ? "wide" : ""} key={key}>
                  {
                    {
                      title:
                        section === "education"
                          ? "Qualification / programme"
                          : "Role / project title",
                      organization:
                        section === "education"
                          ? "School / university"
                          : "Organisation",
                      location: "Location",
                      dates: "Dates",
                      details: "Highlights",
                      id: "",
                    }[key]
                  }
                  {key === "details" ? (
                    <textarea
                      rows={4}
                      maxLength={12000}
                      value={entry[key]}
                      placeholder="One achievement or contribution per line."
                      onChange={(e) =>
                        editContent(
                          section,
                          c[section].map((item, i) =>
                            i === index
                              ? { ...item, [key]: e.target.value }
                              : item,
                          ),
                        )
                      }
                    />
                  ) : (
                    <input
                      maxLength={300}
                      value={entry[key]}
                      placeholder={
                        key === "dates" ? "e.g. Sep 2023 – Present" : ""
                      }
                      onChange={(e) =>
                        editContent(
                          section,
                          c[section].map((item, i) =>
                            i === index
                              ? { ...item, [key]: e.target.value }
                              : item,
                          ),
                        )
                      }
                    />
                  )}
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        <button
          type="button"
          className="button secondary full"
          disabled={c[section].length >= 30}
          onClick={() => editContent(section, [...c[section], newEntry()])}
        >
          <Icon name="plus" size={17} /> Add {label.toLowerCase()}
        </button>
      </div>
    );
  }
  return (
    <main id="main" className="workspace">
      <style>{`@page {size:${c.paper};margin:14mm;}`}</style>
      <header className="workspace-header">
        <Brand />
        <div className="document-name">
          <input
            aria-label="Document title"
            value={doc.title}
            maxLength={160}
            onChange={(e) =>
              setDoc({
                ...doc,
                title: e.target.value,
                updated_at: new Date().toISOString(),
              })
            }
          />
          <span role="status">
            <span
              className={dirty || localFailed ? "save-dot pending" : "save-dot"}
            />
            {dirty ? "Unsaved account changes" : status}
          </span>
        </div>
        <div className="workspace-actions">
          <Link
            href="/dashboard"
            onClick={goBack}
            className="button ghost small"
          >
            My documents
          </Link>
          <button
            onClick={saveCloud}
            disabled={busy}
            className="button secondary small"
          >
            <Icon name="cloud" size={16} />
            {busy ? "Saving…" : cloud ? "Save changes" : "Save to account"}
          </button>
          <button
            className="button small"
            onClick={() => {
              setActive("review");
              setPrintHelp(true);
            }}
          >
            <Icon name="download" size={16} /> Print / PDF
          </button>
        </div>
      </header>
      <div className="workspace-body">
        <aside className="editor-sidebar">
          <Link href="/templates" onClick={goBack} className="back-link">
            ← All templates
          </Link>
          <span className="eyebrow">YOUR DOCUMENT</span>
          <nav aria-label="Editor sections">
            {steps.map(([key, label], i) => (
              <button
                className={active === key ? "current" : ""}
                onClick={() => {
                  setActive(key);
                  setPreview(false);
                }}
                key={key}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                {label}
              </button>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <Icon name="shield" size={23} />
            <b>Your story. Your control.</b>
            <p>
              {cloud
                ? "Account edits are saved when you choose Save changes."
                : "Your draft saves in this browser. Choose Save to account to keep a cloud copy."}
            </p>
            <Link href="/guides" target="_blank" className="text-link">
              Writing guides ↗
            </Link>
          </div>
        </aside>
        <section className={`editor-panel ${preview ? "mobile-hidden" : ""}`}>
          <div className="editor-heading">
            <span className="eyebrow">
              {letter ? "APPLICATION LETTER" : "RESUME & CV BUILDER"}
            </span>
            <h1>{steps.find((s) => s[0] === active)?.[1]}</h1>
            <p>
              {active === "details"
                ? "Start with the essentials. Make it easy for someone to reach you."
                : active === "experience"
                  ? "Show what you did, how you contributed, and what changed."
                  : active === "education"
                    ? "Add your qualifications, training, and academic work."
                    : active === "more"
                      ? "Build a fuller picture of your skills and contribution."
                      : active === "letter"
                        ? "Write with purpose. Specific, truthful examples make a stronger impression."
                        : active === "design"
                          ? "Choose a look that lets your experience lead."
                          : "A thoughtful final check before your next step."}
            </p>
          </div>
          {error && (
            <div className="notice error" role="alert">
              {error}
              {/Sign in first/.test(error) && (
                <>
                  {" "}
                  <Link href="/login">Sign in →</Link>
                </>
              )}
            </div>
          )}
          {localFailed && (
            <div role="alert" className="notice error">
              Browser storage is unavailable or full. Keep this page open and
              export a backup to preserve your work.
            </div>
          )}
          {active === "details" && (
            <div className="form-grid">
              {field(
                "name",
                doc.document_type === "recommendation_letter"
                  ? "Recommender’s name"
                  : "Full name",
                "e.g. Alex Morgan",
              )}
              {field(
                "headline",
                doc.document_type === "recommendation_letter"
                  ? "Recommender’s role"
                  : "Professional title / study focus",
                "e.g. Computer Science Student",
              )}
              {field("email", "Email address", "you@example.com")}
              {field("phone", "Phone number", "Include the country code")}
              {field("location", "Location", "City, Country")}
              {field(
                "website",
                "Website / portfolio",
                "Your professional link",
              )}
              {!letter &&
                field(
                  "summary",
                  doc.document_type === "scholarship_cv"
                    ? "Academic profile"
                    : "Professional summary",
                  "What is your background? Which strengths are relevant to this application?",
                  true,
                  "Write 2–4 specific sentences. Avoid claims you cannot support.",
                )}
            </div>
          )}
          {active === "experience" && (
            <>
              {repeat("experience", "Experience")}
              <div className="writing-tip">
                <Icon name="book" size={18} />
                <p>
                  Use recent experience first. Start each highlight with an
                  action and add a result you can verify.
                </p>
              </div>
              {repeat("volunteering", "Volunteering")}
            </>
          )}
          {active === "education" && (
            <>
              {repeat("education", "Education")}
              {repeat("projects", "Project")}
            </>
          )}
          {active === "more" && (
            <div className="form-grid">
              {field(
                "skills",
                "Skills",
                "Relevant tools, practical skills, and technical knowledge",
                true,
              )}
              {field(
                "languages",
                "Languages",
                "Language — level (state whether tested or self-assessed)",
                true,
              )}
              {field(
                "certifications",
                "Certifications & training",
                "Certificate — provider — year",
                true,
              )}
              {field(
                "awards",
                "Awards & achievements",
                "Award — organisation — year",
                true,
              )}
              {field(
                "publications",
                "Publications",
                "Title — publication — date — link",
                true,
              )}
              {field(
                "additional",
                "Additional information",
                "Relevant availability, licences, or other requested details",
                true,
                "Optional. Avoid passport numbers, bank information, and unrelated personal details.",
              )}
            </div>
          )}
          {active === "letter" && (
            <>
              {doc.document_type === "recommendation_letter" && (
                <div className="notice">
                  Draft only: your recommender must verify, edit, and approve
                  the final letter. Do not invent their endorsement or
                  signature.
                </div>
              )}
              {doc.document_type === "personal_statement" && (
                <div className="notice">
                  Follow the programme’s prompt and word limit. A personal
                  statement usually starts with your narrative; recipient,
                  greeting, and closing fields are optional.
                </div>
              )}
              <div className="form-grid">
                {field(
                  "recipient",
                  "Recipient",
                  "Hiring manager / Admissions committee",
                )}
                {field("organization", "Organisation / programme")}
                {field("date", "Date", "7 October 2026")}
                {field("subject", "Subject / application title")}
                {field("opening", "Opening", "Dear Admissions Committee,")}
                {field(
                  "body",
                  "Main paragraphs",
                  "Explain your purpose, give specific evidence, connect your background to this opportunity, and describe your next step.",
                  true,
                  "Separate paragraphs with a blank line. Follow the application’s prompt and word limit.",
                )}
                {field(
                  "closing",
                  doc.document_type === "recommendation_letter"
                    ? "Closing (recommender to complete)"
                    : "Closing",
                  "Kind regards,",
                  true,
                )}
              </div>
              <p className="quiet">
                {c.body.trim() ? c.body.trim().split(/\s+/).length : 0} words in
                main paragraphs
              </p>
            </>
          )}
          {active === "design" && (
            <>
              <label>
                Template
                <select
                  value={c.template}
                  onChange={(e) => {
                    const t = findTemplate(e.target.value);
                    setDoc({
                      ...doc,
                      document_type: t.kind,
                      content: { ...c, template: t.id, accent: t.color },
                      updated_at: new Date().toISOString(),
                    });
                  }}
                >
                  {templates
                    .filter((t) => isLetter(t.kind) === letter)
                    .map((t) => (
                      <option value={t.id} key={t.id}>
                        {t.name}
                      </option>
                    ))}
                </select>
              </label>
              <div className="design-field">
                <span>Accent colour</span>
                <div className="swatches">
                  {[
                    "#263c50",
                    "#067c75",
                    "#2859a0",
                    "#635295",
                    "#a15032",
                    "#65543e",
                  ].map((color) => (
                    <button
                      key={color}
                      style={{ background: color }}
                      aria-label={`Use ${color} accent`}
                      aria-pressed={c.accent === color}
                      onClick={() => editContent("accent", color)}
                    >
                      {c.accent === color && <Icon name="check" size={17} />}
                    </button>
                  ))}
                  <input
                    type="color"
                    aria-label="Custom accent colour"
                    value={c.accent}
                    onChange={(e) => editContent("accent", e.target.value)}
                  />
                </div>
              </div>
              <label>
                Paper size
                <select
                  value={c.paper}
                  onChange={(e) =>
                    editContent("paper", e.target.value as "A4" | "Letter")
                  }
                >
                  <option>A4</option>
                  <option>Letter</option>
                </select>
              </label>
              <div className="info-box">
                <b>Simple by design.</b>
                <p>
                  Layouts keep a single reading order and selectable text. The
                  final page count depends on your content and print settings.
                </p>
              </div>
              <button
                className="button secondary full"
                onClick={() => {
                  if (
                    confirm(
                      "Replace the current content with a fictional example? Export a backup first if you need to keep your text.",
                    )
                  )
                    setDoc({
                      ...doc,
                      content: sampleContent(c.template),
                      updated_at: new Date().toISOString(),
                    });
                }}
              >
                Load fictional example
              </button>
            </>
          )}
          {active === "review" && (
            <>
              <div className="completion">
                <div>
                  <b>
                    {done} of {checklist.length}
                  </b>
                  <span>content checks complete</span>
                </div>
                <progress max={checklist.length} value={done} />
                <p>This is a content checklist, not an ATS or hiring score.</p>
              </div>
              <ul className="check-list">
                {checklist.map((item) => (
                  <li key={item.label} className={item.done ? "complete" : ""}>
                    <span>
                      {item.done ? (
                        <Icon name="check" size={15} />
                      ) : (
                        <span className="empty-check" />
                      )}
                    </span>
                    {item.label}
                  </li>
                ))}
              </ul>
              <div className="info-box">
                <b>Before submitting</b>
                <p>
                  Verify dates, contact details, spelling, and every claim. Read
                  the employer or programme’s requirements. Review all PDF pages
                  after export.
                </p>
              </div>
              <button
                className="button full"
                onClick={() => setPrintHelp(true)}
              >
                <Icon name="download" size={17} /> Print / save PDF
              </button>
              <button
                className="button secondary full spaced"
                onClick={() => downloadBackup(doc)}
              >
                Export editable backup (.json)
              </button>
              <button
                className="button secondary full spaced"
                onClick={saveCloud}
                disabled={busy}
              >
                {busy
                  ? "Saving…"
                  : cloud
                    ? "Save account changes"
                    : "Save to my account"}
              </button>
            </>
          )}
          <div className="editor-navigation">
            <button
              className="button ghost"
              disabled={steps[0][0] === active}
              onClick={() =>
                setActive(
                  steps[
                    Math.max(0, steps.findIndex((s) => s[0] === active) - 1)
                  ][0],
                )
              }
            >
              ← Previous
            </button>
            {active !== "review" && (
              <button
                className="button"
                onClick={() =>
                  setActive(
                    steps[
                      Math.min(
                        steps.length - 1,
                        steps.findIndex((s) => s[0] === active) + 1,
                      )
                    ][0],
                  )
                }
              >
                Continue <Icon name="arrow" size={17} />
              </button>
            )}
          </div>
        </section>
        <section className={`preview-panel ${preview ? "mobile-visible" : ""}`}>
          <div className="preview-toolbar">
            <span>
              <span className="status-dot" /> LIVE PREVIEW
            </span>
            <span>
              {c.paper} · {findTemplate(c.template).name}
            </span>
          </div>
          <div className="preview-document">
            <DocumentPreview content={c} kind={doc.document_type} />
          </div>
          <p className="preview-footnote">
            Empty sections stay off your document. Final pagination appears in
            print preview.
          </p>
        </section>
      </div>
      <button
        className="mobile-preview-toggle button"
        onClick={() => setPreview(!preview)}
      >
        {preview ? "Back to editing" : "Preview document"}
      </button>
      {printHelp && (
        <div className="modal-backdrop">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="print-title"
            className="modal"
          >
            <button
              className="modal-close"
              aria-label="Close print instructions"
              onClick={() => setPrintHelp(false)}
            >
              <Icon name="close" />
            </button>
            <Icon name="download" size={30} />
            <h2 id="print-title">Ready for your next step.</h2>
            <p>
              Your browser will open the print dialog. Choose <b>Save as PDF</b>
              , select <b>{c.paper}</b>, and turn off browser headers and
              footers. Review every page before saving.
            </p>
            <p className="quiet">
              Only the document is printed. The editor and guidance are
              excluded.
            </p>
            <button
              autoFocus
              className="button full"
              onClick={() => {
                setPrintHelp(false);
                const old = document.title;
                document.title = doc.title || "VitaPath document";
                requestAnimationFrame(() => {
                  window.print();
                  document.title = old;
                });
              }}
            >
              Open print dialog <Icon name="arrow" size={18} />
            </button>
            <button
              className="text-button spaced"
              onClick={() => setPrintHelp(false)}
            >
              Keep editing
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
