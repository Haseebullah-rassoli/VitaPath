"use client";
import Link from "next/link";

export default function Login(){
 return <main className="authPage">
  <section className="authPanel">
   <Link href="/" className="authBrand"><img src="/VitaPath/logo.png" alt="VitaPath"/><span><b>VitaPath</b><small>Build Today. Grow Tomorrow.</small></span></Link>
   <div className="authBadge">ACCOUNT SYSTEM · COMING NEXT</div>
   <h1>Welcome to VitaPath</h1>
   <p className="authLead">Secure cloud accounts are not enabled yet. You can already build, preview and save a resume draft locally on your device.</p>
   <Link href="/builder" className="cta authCta">Continue to Resume Builder →</Link>
   <div className="authInfo"><b>Why is sign-in temporarily unavailable?</b><p>We will enable registration only after the production authentication and database are connected correctly. This avoids sending your email or password to a placeholder service.</p></div>
   <Link href="/" className="backHome">← Back to home</Link>
  </section>
  <aside className="authVisual"><div className="authVisualInner"><img src="/VitaPath/logo.png" alt="VitaPath HR logo"/><h2>One profile.<br/>A world of opportunities.</h2><p>International resumes, scholarship documents and career tools — designed around clarity and privacy.</p><div><span>✓ ATS-friendly</span><span>✓ Global formats</span><span>✓ Privacy-minded</span></div></div></aside>
 </main>
}