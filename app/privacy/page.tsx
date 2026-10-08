import { Header, Footer } from "../../components/shell";
import Link from "next/link";
export default function Privacy() {
  return (
    <>
      <Header />
      <main id="main" className="container privacy-page">
        <div className="page-heading">
          <span className="eyebrow">PRIVACY & YOUR DATA</span>
          <h1>
            Your documents.
            <br />
            <em>Your decisions.</em>
          </h1>
          <p>How this version of VitaPath stores and uses your information.</p>
        </div>
        <article className="prose-card">
          <h2>Browser drafts</h2>
          <p>
            Documents created without cloud saving are stored in this browser’s
            local storage. They are not automatically uploaded to your account.
            Anyone using the same browser profile may be able to open those
            drafts. Clearing browser data can remove them permanently.
          </p>
          <h2>Account documents</h2>
          <p>
            When you choose “Save to account”, your document content is sent to
            the VitaPath Supabase project. Account access uses Supabase
            Authentication. Database access policies limit ordinary signed-in
            users to their own documents. Project administrators can administer
            the database; this is not end-to-end encrypted storage.
          </p>
          <h2>Passwords and sessions</h2>
          <p>
            Your password is handled by Supabase Authentication. VitaPath does
            not put passwords in document records. A session is stored in your
            browser to keep you signed in. Sign out on shared devices, and
            delete any browser drafts you do not want to leave there.
          </p>
          <h2>Exports and deletion</h2>
          <p>
            You can export a document as a JSON backup or print it to PDF.
            Downloaded files are controlled by you. Deleting a document from My
            documents removes that copy from active storage; separately saved
            browser copies, downloads, and service backups may remain. This
            version does not include self-service account deletion.
          </p>
          <h2>Contact and support requests</h2>
          <p>When you send a contact form, VitaPath stores your name, email address, category, subject, message, and timestamps in Supabase. If you are signed in, the request is linked to your account so you can view its status and replies. Other ordinary users cannot read your requests. Project administrators can review and respond to the support queue. Messages are not posted publicly, and your CV is not attached automatically.</p>
          <p>Requests sent without an account cannot be viewed in an account history. The team may use the supplied email address to respond. Premium interest requests are stored in the same queue; they do not start a paid subscription. Ask through Contact if you want a support message reviewed or removed.</p>
          <h2>Hosting and service providers</h2>
          <p>
            The website is hosted on GitHub Pages and account data is stored
            with Supabase. Those services process requests and may retain
            operational logs according to their own policies. This application
            does not add advertising trackers or send document text to an AI
            writing service.
          </p>
          <h2>Keep sensitive information out</h2>
          <p>
            Include only what is needed for your application. Do not store
            passwords, bank account information, passport scans, or identity
            document numbers in a CV. Review your exported file before sharing
            it.
          </p>
          <h2>About this service</h2>
          <p>
            VitaPath is maintained by Haseebullah Rassoli. For a privacy
            concern, use the <Link href="/contact?category=privacy">private contact form</Link>. You can also visit the{" "}
            <a
              href="https://github.com/Haseebullah-rassoli/VitaPath"
              target="_blank"
              rel="noopener noreferrer"
            >
              project on GitHub
            </a>
            . Do not post private document content or account credentials in a
            public issue.
          </p>
          <p>
            <a
              href="https://supabase.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Supabase privacy policy
            </a>{" "}
            ·{" "}
            <a
              href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub privacy statement
            </a>
          </p>
          <Link href="/dashboard" className="button">
            Manage my documents
          </Link>
        </article>
      </main>
      <Footer />
    </>
  );
}
