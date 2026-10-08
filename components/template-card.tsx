import { templateHref } from "../lib/routes";
import { type Template, sampleContent } from "../lib/documents";
import { DocumentPreview } from "./document-preview";
import { Icon } from "./icon";
export function TemplateCard({ template: t }: { template: Template }) {
  return (
    <article className="template-card">
      <a
        href={templateHref(t.id)}
        className={`template-art art-${t.id}`}
        aria-label={`Use ${t.name} template`}
      >
        <div className="template-badge">{t.tag}</div>
        <div className="mini-paper">
          <DocumentPreview content={sampleContent(t.id)} kind={t.kind} mini />
        </div>
        <span className="template-overlay">
          Use this template <Icon name="arrow" size={18} />
        </span>
      </a>
      <div className="template-info">
        <div>
          <h3>{t.name}</h3>
          <span className="color-dot" style={{ background: t.color }} />
        </div>
        <p>{t.description}</p>
        <a className="button template-use" href={templateHref(t.id)}>
          Use template <Icon name="arrow" size={16} />
        </a>
      </div>
    </article>
  );
}
