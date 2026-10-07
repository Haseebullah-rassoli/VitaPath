import Link from "next/link";
import { Header, Footer } from "../components/shell";
import { Icon } from "../components/icon";
import { DocumentPreview } from "../components/document-preview";
import { TemplateCard } from "../components/template-card";
import { templates, sampleContent } from "../lib/documents";
export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <section className="home-hero container">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="status-dot" /> YOUR NEXT CHAPTER STARTS HERE
            </span>
            <h1>
              A better document.
              <br />A bigger <em>possibility.</em>
            </h1>
            <p>
              Your experience deserves to stand out. Create thoughtful resumes,
              CVs, and application letters for the opportunities that matter to
              you.
            </p>
            <div className="hero-actions">
              <Link href="/builder" className="button large">
                Build my resume <Icon name="arrow" />
              </Link>
              <Link href="/templates" className="button secondary large">
                Explore templates
              </Link>
            </div>
            <div className="hero-assurances">
              <span>
                <Icon name="check" size={15} /> Start without an account
              </span>
              <span>
                <Icon name="check" size={15} /> Free PDF printing
              </span>
            </div>
          </div>
          <div className="hero-stage" aria-label="Example resume designs">
            <div className="stage-grid" />
            <span className="stage-caption">
              A LITTLE STRUCTURE. A LOT OF POTENTIAL.
            </span>
            <div className="hero-paper back-paper">
              <DocumentPreview
                content={sampleContent("academic")}
                kind="scholarship_cv"
                mini
              />
            </div>
            <div className="hero-paper front-paper">
              <DocumentPreview
                content={sampleContent("modern")}
                kind="resume"
                mini
              />
            </div>
            <div className="floating-note">
              <span className="note-icon">
                <Icon name="check" />
              </span>
              <div>
                <b>Make it yours.</b>
                <small>Your story. Beautifully presented.</small>
              </div>
            </div>
            <span className="example-label">
              Fictional example · The Modern template
            </span>
          </div>
        </section>
        <section className="benefit-bar">
          <div className="container benefit-inner">
            <span>
              <Icon name="globe" /> International applications
            </span>
            <span>
              <Icon name="file" /> 8 CV & resume styles
            </span>
            <span>
              <Icon name="mail" /> 4 letter formats
            </span>
            <span>
              <Icon name="shield" /> You control your documents
            </span>
          </div>
        </section>
        <section className="section container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">START WITH A STRONG FOUNDATION</span>
              <h2>A style for every next step.</h2>
            </div>
            <Link href="/templates" className="text-link">
              View all 12 templates <Icon name="arrow" size={18} />
            </Link>
          </div>
          <p className="section-intro">
            From your first application to your next big move. Choose a layout,
            add your story, and make it your own.
          </p>
          <div className="template-grid home-templates">
            {["modern", "europe", "gulf", "scholar"].map((id) => (
              <TemplateCard
                key={id}
                template={templates.find((t) => t.id === id)!}
              />
            ))}
          </div>
          <p className="quiet">
            Template previews use fictional example content. European layouts
            are independent VitaPath designs, not official Europass documents.
          </p>
        </section>
        <section className="tools-section">
          <div className="container">
            <div className="section-heading">
              <div>
                <span className="eyebrow">MORE THAN A RESUME</span>
                <h2>Bring your whole application together.</h2>
              </div>
              <p>
                One workspace for the documents
                <br />
                that open your next door.
              </p>
            </div>
            <div className="tools-grid">
              {[
                [
                  "file",
                  "Resume & CV",
                  "Show the experience, skills, and achievements that make you a strong fit.",
                  "essential",
                ],
                [
                  "book",
                  "Scholarship CV",
                  "Put your education, leadership, and community contribution in focus.",
                  "scholar",
                ],
                [
                  "mail",
                  "Cover letter",
                  "Connect what you have done with what your next employer needs.",
                  "cover",
                ],
                [
                  "globe",
                  "Motivation letter",
                  "Explain why this programme, why you, and what comes next.",
                  "motivation",
                ],
                [
                  "shield",
                  "Recommendation draft",
                  "Prepare clear evidence for your recommender to review and approve.",
                  "recommendation",
                ],
                [
                  "file",
                  "Personal statement",
                  "Shape a purposeful, authentic story in your own words.",
                  "statement",
                ],
              ].map(([icon, title, text, template]) => (
                <Link
                  href={`/builder?template=${template}`}
                  className="tool-card"
                  key={template}
                >
                  <span className="tool-icon">
                    <Icon name={icon} />
                  </span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <span className="text-link">
                    Start writing <Icon name="arrow" size={16} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section className="section container process-section">
          <div>
            <span className="eyebrow">FROM BLANK PAGE TO NEXT CHAPTER</span>
            <h2>
              You bring the story.
              <br />
              We bring the structure.
            </h2>
            <p className="section-intro">
              No design experience needed. Just a clear path from your first
              detail to your finished document.
            </p>
            <Link href="/guides" className="text-link">
              Explore the writing guides <Icon name="arrow" size={18} />
            </Link>
          </div>
          <ol className="steps">
            <li>
              <span>01</span>
              <div>
                <h3>Choose your starting point</h3>
                <p>
                  Find a layout for your career, study, or scholarship
                  application.
                </p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <h3>Make your experience count</h3>
                <p>
                  Follow focused prompts while your document takes shape in the
                  live preview.
                </p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <h3>Review. Save. Take the next step.</h3>
                <p>
                  Check your content, save a browser draft or account copy, and
                  print to PDF.
                </p>
              </div>
            </li>
          </ol>
        </section>
        <section className="privacy-banner container">
          <span className="privacy-emblem">
            <Icon name="shield" size={46} />
          </span>
          <div>
            <span className="eyebrow">YOUR STORY BELONGS TO YOU</span>
            <h2>Build with confidence.</h2>
            <p>
              Start with a draft on your device. Choose when to save to your
              account. Export a backup and delete documents when you no longer
              need them.
            </p>
          </div>
          <Link href="/privacy" className="button secondary">
            About your data <Icon name="arrow" size={17} />
          </Link>
        </section>
        <section className="section container faq-section">
          <div>
            <span className="eyebrow">A FEW HELPFUL ANSWERS</span>
            <h2>Before you begin.</h2>
          </div>
          <div className="faq-list">
            {[
              [
                "Do I need an account?",
                "No. You can build and print a document without signing in. Browser drafts stay on this device. Sign in when you want to save documents to your account.",
              ],
              [
                "Can I download my document as a PDF?",
                "Yes. Choose Print / PDF in the editor, then select Save as PDF in your browser or device print dialog. Choose A4 or Letter, turn off browser headers and footers, and check the preview before saving.",
              ],
              [
                "Are the templates ATS compatible?",
                "The CV templates use selectable text, standard headings, and a single-column reading order. Applicant tracking systems differ, so compatibility cannot be guaranteed. Always follow the employer’s requested format.",
              ],
              [
                "Is the European CV an official Europass CV?",
                "No. It is an independent VitaPath layout. If an application specifically requires Europass, use the official Europass builder linked in our writing guides.",
              ],
              [
                "Can VitaPath write my achievements for me?",
                "The editor provides prompts, examples, and a completion checklist. You write the content and verify every claim. It does not invent qualifications or offer an automated hiring score.",
              ],
            ].map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <span>+</span>
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        </section>
        <section className="closing-cta">
          <span className="eyebrow">
            YOUR FUTURE IS WORTH A GOOD FIRST IMPRESSION
          </span>
          <h2>Let’s write your next chapter.</h2>
          <Link href="/builder" className="button large">
            Create my first document <Icon name="arrow" />
          </Link>
          <p>Start free. Make it yours. Go further.</p>
        </section>
      </main>
      <Footer />
    </>
  );
}
