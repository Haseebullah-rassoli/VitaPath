"use client";
import { useEffect, useState } from "react";
import { Header, Footer } from "../../components/shell";
import { TemplateCard } from "../../components/template-card";
import { templates } from "../../lib/documents";
export default function Templates() {
  const [category, setCategory] = useState("All templates");
  const categories = [
    "All templates",
    "Professional",
    "Europe",
    "Gulf / GCC",
    "Scholarship",
    "Students",
    "Letters",
  ];
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get("category");
    if (c && categories.includes(c)) setCategory(c);
  }, []);
  const visible = templates.filter(
    (t) => category === "All templates" || t.category === category,
  );
  return (
    <>
      <Header />
      <main id="main" className="container catalog">
        <div className="page-heading">
          <span className="eyebrow">THE TEMPLATE COLLECTION</span>
          <h1>
            Find your kind of <em>first impression.</em>
          </h1>
          <p>
            Purposeful layouts for careers, education, and everything you aspire
            to.
            <br />
            Every template is editable. Every story is yours.
          </p>
        </div>
        <div className="filter-tabs" aria-label="Template categories">
          {categories.map((c) => (
            <button
              key={c}
              className={c === category ? "selected" : ""}
              aria-pressed={c === category}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="catalog-meta">
          <span>{visible.length} templates</span>
          <span>Editable content · A4 & Letter · Print to PDF</span>
        </div>
        <div className="template-grid">
          {visible.map((t) => (
            <TemplateCard template={t} key={t.id} />
          ))}
        </div>
        <div className="info-box">
          <b>A format is a starting point, not an application requirement.</b>
          <p>
            Check the employer or programme instructions before submitting.
            VitaPath is independent of Europass and scholarship providers.
            Examples are fictional; replace them with your own verified
            experience.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
