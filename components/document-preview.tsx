import {
  type Content,
  type DocumentKind,
  type Entry,
  isLetter,
} from "../lib/documents";
import type { CSSProperties } from "react";
function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/\n\s*\n/)
        .filter(Boolean)
        .map((p, i) => (
          <p className="prose-line" key={i}>
            {p}
          </p>
        ))}
    </>
  );
}
function TextSection({ title, text }: { title: string; text: string }) {
  return text.trim() ? (
    <section className="cv-section">
      <h3>{title}</h3>
      <Paragraphs text={text} />
    </section>
  ) : null;
}
function Entries({ title, entries }: { title: string; entries: Entry[] }) {
  const filled = entries.filter((e) => e.title || e.organization || e.details);
  return filled.length ? (
    <section className="cv-section">
      <h3>{title}</h3>
      {filled.map((e, i) => (
        <div className="cv-entry" key={`${e.id}-${i}`}>
          <div className="cv-entry-top">
            <strong>{e.title}</strong>
            <span>{e.dates}</span>
          </div>
          <div className="cv-entry-meta">
            {[e.organization, e.location].filter(Boolean).join(" · ")}
          </div>
          {e.details && (
            <ul>
              {e.details
                .split("\n")
                .filter((s) => s.trim())
                .map((line, i) => (
                  <li key={i}>{line.replace(/^[•\-]\s*/, "")}</li>
                ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  ) : null;
}
export function DocumentPreview({
  content: c,
  kind,
  mini = false,
}: {
  content: Content;
  kind: DocumentKind;
  mini?: boolean;
}) {
  const academic = kind === "scholarship_cv" || c.template === "graduate";
  return (
    <article
      className={`cv-sheet theme-${c.template}${mini ? " miniature" : ""}`}
      style={{ "--cv-accent": c.accent } as CSSProperties}
      aria-label="Document preview"
    >
      <header className="cv-header">
        <h2>
          {c.name || <span className="screen-placeholder">Your name</span>}
        </h2>
        {c.headline && <div className="cv-headline">{c.headline}</div>}
        <div className="cv-contact">
          {[c.email, c.phone, c.location, c.website]
            .filter(Boolean)
            .join(" · ")}
        </div>
      </header>
      {isLetter(kind) ? (
        <div className="letter-content">
          {kind === "recommendation_letter" && (
            <p className="draft-label">DRAFT · FOR RECOMMENDER REVIEW</p>
          )}
          {c.date && <p>{c.date}</p>}
          {c.recipient && (
            <p>
              {c.recipient}
              <br />
              {c.organization}
            </p>
          )}
          {c.subject && <h3 className="letter-subject">{c.subject}</h3>}
          {c.opening && <p>{c.opening}</p>}
          <Paragraphs text={c.body} />
          {c.closing && (
            <p className="letter-closing">
              {c.closing}
              <br />
              {kind === "recommendation_letter" ? "" : c.name}
            </p>
          )}
        </div>
      ) : (
        <div className="cv-body">
          <TextSection
            title={academic ? "Academic profile" : "Profile"}
            text={c.summary}
          />
          {academic && <Entries title="Education" entries={c.education} />}
          <Entries title="Experience" entries={c.experience} />
          {!academic && <Entries title="Education" entries={c.education} />}
          <Entries title="Projects & research" entries={c.projects} />
          <Entries title="Leadership & volunteering" entries={c.volunteering} />
          <TextSection title="Skills" text={c.skills} />
          <TextSection title="Languages" text={c.languages} />
          <TextSection
            title="Certifications & training"
            text={c.certifications}
          />
          <TextSection title="Awards & achievements" text={c.awards} />
          <TextSection title="Publications" text={c.publications} />
          <TextSection title="Additional information" text={c.additional} />
        </div>
      )}
    </article>
  );
}
