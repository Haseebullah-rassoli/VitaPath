"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { Header, Footer } from "../../components/shell";
import { Icon } from "../../components/icon";
import { createClient } from "../../lib/supabase/client";
import {
  type VitaDocument,
  localDocuments,
  saveLocal,
  deleteLocal,
  migrateLegacyDraft,
  parseDocument,
  downloadBackup,
  kindNames,
  findTemplate,
} from "../../lib/documents";
export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [local, setLocal] = useState<VitaDocument[]>([]);
  const [remote, setRemote] = useState<VitaDocument[]>([]);
  const [tab, setTab] = useState<"browser" | "cloud">("browser");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [profile, setProfile] = useState(false);
  const file = useRef<HTMLInputElement>(null);
  const generation = useRef(0);
  function refreshLocal() {
    try {
      migrateLegacyDraft();
      setLocal(localDocuments());
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Browser drafts could not be loaded.",
      );
    }
  }
  async function refreshAccount() {
    const request = ++generation.current;
    setLoading(true);
    try {
      const client = createClient();
      const {
        data: { user },
        error,
      } = await client.auth.getUser();
      if (request !== generation.current) return;
      if (error && error.name !== "AuthSessionMissingError") throw error;
      setUser(user);
      if (user) {
        const { data, error } = await client
          .from("documents")
          .select("*")
          .eq("user_id", user.id)
          .order("updated_at", { ascending: false });
        if (error) throw error;
        if (request !== generation.current) return;
        setRemote((data || []).map(parseDocument));
        const { data: p } = await client
          .from("profiles")
          .select("full_name,headline")
          .eq("id", user.id)
          .maybeSingle();
        if (request !== generation.current) return;
        setName(p?.full_name || "");
        setHeadline(p?.headline || "");
        setTab("cloud");
      } else setRemote([]);
    } catch (e) {
      if (request === generation.current)
        setError(
          e instanceof Error ? e.message : "Unable to load account documents.",
        );
    } finally {
      if (request === generation.current) setLoading(false);
    }
  }
  useEffect(() => {
    refreshLocal();
    refreshAccount();
    const { data } = createClient().auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        generation.current++;
        setUser(null);
        setRemote([]);
        setTab("browser");
        setName("");
        setHeadline("");
        setProfile(false);
        setLoading(false);
      }
    });
    return () => {
      generation.current++;
      data.subscription.unsubscribe();
    };
  }, []);
  async function action(doc: VitaDocument, action: "delete" | "duplicate") {
    if (busy) return;
    if (
      action === "delete" &&
      !confirm(
        `Delete “${doc.title}” from ${tab === "cloud" ? "your account" : "this browser"}? This cannot be undone.`,
      )
    )
      return;
    setBusy(true);
    setError("");
    try {
      if (tab === "cloud" && user) {
        const client = createClient();
        if (action === "delete") {
          const { data, error } = await client
            .from("documents")
            .delete()
            .eq("id", doc.id)
            .eq("user_id", user.id)
            .select("id");
          if (error) throw error;
          if (!data?.length)
            throw new Error(
              "The document was not deleted. Refresh and try again.",
            );
          setRemote((list) => list.filter((d) => d.id !== doc.id));
        } else {
          const { data, error } = await client
            .from("documents")
            .insert({
              title: `${doc.title.slice(0, 152)} (copy)`,
              document_type: doc.document_type,
              content: doc.content,
              user_id: user.id,
            })
            .select("*")
            .single();
          if (error) throw error;
          setRemote((list) => [parseDocument(data), ...list]);
        }
      } else {
        if (action === "delete") deleteLocal(doc.id);
        else
          saveLocal({
            ...doc,
            id: crypto.randomUUID(),
            title: `${doc.title.slice(0, 152)} (copy)`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        refreshLocal();
      }
      setMessage(
        action === "delete" ? "Document deleted." : "A copy is ready to edit.",
      );
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "The action could not be completed.",
      );
    } finally {
      setBusy(false);
    }
  }
  async function importFile(selected: File) {
    setError("");
    try {
      if (selected.size > 250000)
        throw new Error("Choose a VitaPath JSON backup under 250 KB.");
      const value = JSON.parse(await selected.text());
      if (value.format !== "vitapath" || value.version !== 1)
        throw new Error("Choose a JSON backup exported from VitaPath.");
      const doc = parseDocument(value.document);
      saveLocal({
        ...doc,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      refreshLocal();
      setTab("browser");
      setMessage("Backup imported as a new browser draft.");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "The backup could not be imported.",
      );
    } finally {
      if (file.current) file.current.value = "";
    }
  }
  async function saveProfile() {
    if (!user) return;
    setBusy(true);
    setError("");
    try {
      const { error } = await createClient()
        .from("profiles")
        .upsert(
          { id: user.id, full_name: name.trim(), headline: headline.trim() },
          { onConflict: "id" },
        );
      if (error) throw error;
      setMessage("Profile saved.");
      setProfile(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Profile could not be saved.");
    } finally {
      setBusy(false);
    }
  }
  const visible = (tab === "browser" ? local : remote).filter((d) =>
    `${d.title} ${kindNames[d.document_type]}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <>
      <Header />
      <main id="main" className="container dashboard-page">
        <div className="dashboard-heading">
          <div>
            <span className="eyebrow">YOUR WORKSPACE</span>
            <h1>
              {user && name
                ? `Welcome back, ${name.split(" ")[0]}.`
                : "Your next chapter, organised."}
            </h1>
            <p>Keep your applications together. Make each one count.</p>
          </div>
          <Link href="/templates" className="button">
            <Icon name="plus" size={18} /> New document
          </Link>
        </div>
        {error && (
          <div className="notice error" role="alert">
            {error}
            <button
              className="text-button"
              onClick={() => {
                setError("");
                refreshLocal();
                refreshAccount();
              }}
            >
              Try again
            </button>
          </div>
        )}
        {message && (
          <div className="notice success" role="status">
            {message}
          </div>
        )}
        {!user && !loading && (
          <div className="account-prompt">
            <span className="tool-icon">
              <Icon name="cloud" />
            </span>
            <div>
              <h3>Take your documents with you.</h3>
              <p>
                Sign in to save account copies and open them on another device.
              </p>
            </div>
            <Link href="/signup" className="button secondary small">
              Create an account
            </Link>
            <Link href="/login" className="text-link">
              Sign in
            </Link>
          </div>
        )}
        {user && (
          <div className="account-strip">
            <span>
              <Icon name="shield" size={17} />
              {user.email}
            </span>
            <div>
              <button
                className="text-button"
                onClick={() => setProfile(!profile)}
              >
                {profile ? "Close profile" : "Edit profile"}
              </button>
              <button
                className="text-button"
                onClick={async () => {
                  const { error } = await createClient().auth.signOut({
                    scope: "local",
                  });
                  if (error) setError(error.message);
                  else
                    setMessage(
                      "Signed out on this device. Browser drafts remain until you delete them.",
                    );
                }}
              >
                Sign out
              </button>
            </div>
          </div>
        )}
        <div className="workspace-plan-strip">
          <div><span className="plan-pill">FREE PLAN</span><span>12 templates, PDF printing, and editable backups.</span></div>
          <div><Link href="/pricing">Explore Premium</Link><Link href="/support#requests">My support requests</Link></div>
        </div>
        {profile && (
          <section className="profile-editor">
            <h2>Your profile</h2>
            <div className="form-grid">
              <label>
                Full name
                <input
                  maxLength={120}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label>
                Professional / study headline
                <input
                  maxLength={180}
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                />
              </label>
            </div>
            <button
              className="button small spaced"
              disabled={busy}
              onClick={saveProfile}
            >
              Save profile
            </button>
          </section>
        )}
        <div className="dashboard-toolbar">
          <div className="filter-tabs">
            <button
              aria-pressed={tab === "browser"}
              className={tab === "browser" ? "selected" : ""}
              onClick={() => setTab("browser")}
            >
              Browser drafts <span>{local.length}</span>
            </button>
            <button
              aria-pressed={tab === "cloud"}
              className={tab === "cloud" ? "selected" : ""}
              onClick={() => setTab("cloud")}
            >
              Account documents <span>{remote.length}</span>
            </button>
          </div>
          <div className="dashboard-tools">
            <label className="search-field">
              <Icon name="search" size={17} />
              <input
                type="search"
                aria-label="Search documents"
                placeholder="Search documents"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <input
              ref={file}
              type="file"
              accept="application/json,.json"
              className="sr-only"
              onChange={(e) => {
                if (e.target.files?.[0]) importFile(e.target.files[0]);
              }}
            />
            <button
              className="button secondary small"
              onClick={() => file.current?.click()}
            >
              Import backup
            </button>
          </div>
        </div>
        <p className="quiet">
          {tab === "browser"
            ? "These drafts are stored on this device. Export a backup before clearing browser data."
            : "Account documents are private to your account. Edits are saved with the Save changes button."}
        </p>
        {loading && tab === "cloud" ? (
          <div className="empty-state">
            <p>Loading account documents…</p>
          </div>
        ) : tab === "cloud" && !user ? (
          <div className="empty-state">
            <Icon name="cloud" size={35} />
            <h2>Your account workspace is waiting.</h2>
            <p>Sign in to see documents saved to your account.</p>
            <Link className="button" href="/login">
              Sign in
            </Link>
          </div>
        ) : visible.length ? (
          <div className="document-grid">
            {visible.map((doc) => (
              <article className="document-card" key={doc.id}>
                <div
                  className="document-card-top"
                  style={{ borderColor: doc.content.accent }}
                >
                  <Icon name="file" size={32} />
                  <span>{kindNames[doc.document_type]}</span>
                </div>
                <div className="document-card-body">
                  <h2>{doc.title}</h2>
                  <p>
                    {findTemplate(doc.content.template).name} ·{" "}
                    {new Date(doc.updated_at).toLocaleDateString()}
                  </p>
                  <Link
                    href={`/builder?id=${encodeURIComponent(doc.id)}${tab === "cloud" ? "&storage=cloud" : ""}`}
                    className="button secondary full"
                  >
                    Open document <Icon name="arrow" size={16} />
                  </Link>
                  <div className="document-options">
                    <button
                      disabled={busy}
                      onClick={() => action(doc, "duplicate")}
                    >
                      Duplicate
                    </button>
                    <button onClick={() => downloadBackup(doc)}>Backup</button>
                    <button
                      disabled={busy}
                      className="danger-text"
                      onClick={() => action(doc, "delete")}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon">
              <Icon name="file" size={32} />
            </span>
            <h2>
              {query
                ? "No matching documents."
                : "A blank page. A fresh possibility."}
            </h2>
            <p>
              {query
                ? "Try a different search."
                : "Choose a template and bring your first document to life."}
            </p>
            <Link href="/templates" className="button">
              Explore templates <Icon name="arrow" size={17} />
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
