import Link from "next/link";

const tools = [
  ["Resume Builder","ATS-friendly resumes for Europe, international careers and GCC opportunities.","Build resume"],
  ["Cover Letter","Professional cover letters tailored to jobs, internships and applications.","Create letter"],
  ["Scholarship CV","Highlight education, leadership, volunteering and achievements.","Build scholarship CV"],
  ["Motivation Letter","Create a clear, structured letter for university and scholarship applications.","Start writing"],
  ["Recommendation Draft","Prepare a polished draft for a recommender to review and sign.","Create draft"]
];

export default function Home(){
  return <main>
    <nav className="nav">
      <Link href="/" className="brand"><img src="/VitaPath/logo.png" alt="VitaPath HR shield logo"/><span><b>VitaPath</b><small>Build Today. Grow Tomorrow.</small></span></Link>
      <div className="navlinks"><a href="#tools">Tools</a><a href="#global">Global</a><a href="#security">Privacy</a></div>
      <div className="actions"><Link href="/login" className="signin">Sign in</Link><Link href="/login" className="cta small">Create account</Link></div>
    </nav>

    <section className="hero">
      <div className="heroCopy">
        <span className="pill">GLOBAL PLATFORM FOR STUDENTS & PROFESSIONALS</span>
        <h1>Your path to a <em>brighter future.</em></h1>
        <p>Build professional resumes, cover letters and scholarship documents with modern guidance for international study and career opportunities.</p>
        <div className="heroActions"><Link href="/builder" className="cta">Create your resume <b>→</b></Link><a href="#tools" className="secondary">Explore tools</a></div>
        <div className="trust"><span>✓ Free to start</span><span>◎ Global formats</span><span>◇ Privacy-minded</span><span>⚡ Fast & simple</span></div>
      </div>
      <div className="heroVisual" aria-label="VitaPath global career platform">
        <div className="globe">◎</div>
        <div className="mock">
          <div className="mockTop"><span className="miniBrand"><img src="/VitaPath/logo.png" alt=""/> VitaPath</span><span>Professional Resume</span></div>
          <div className="mockBody">
            <aside><b>Dashboard</b><span>Resume Builder</span><span>Cover Letter</span><span>Scholarship CV</span><span>Motivation Letter</span><span>My Documents</span></aside>
            <div className="templates"><h3>Choose your professional style</h3><p>Clean, readable and application-ready layouts.</p><div className="sheets"><i></i><i></i><i></i><i></i></div></div>
          </div>
        </div>
        <div className="floating f1">EUROPE</div><div className="floating f2">GCC</div><div className="floating f3">SCHOLARSHIPS</div>
      </div>
    </section>

    <section id="tools" className="toolsSection">
      <div className="sectionHead"><span>ONE PROFILE · MULTIPLE DOCUMENTS</span><h2>Everything you need in one place</h2><p>Professional tools designed around real international applications.</p></div>
      <div className="toolGrid">{tools.map(([title,text,action],i)=><article key={title} className={"tool t"+(i+1)}><div className="icon">{["▤","✉","♜","✎","✓"][i]}</div><h3>{title}</h3><p>{text}</p><Link href={i===0?"/builder":"/login"}>{action} →</Link></article>)}</div>
    </section>

    <section id="global" className="globalStrip"><div><b>International</b><span>Built for global applications</span></div><div><b>5 core tools</b><span>Career & study documents</span></div><div><b>Responsive</b><span>Desktop, tablet & mobile</span></div><div><b>PDF-ready</b><span>Export workflow planned</span></div></section>

    <section id="security" className="security"><div><span className="eyebrow">PRIVACY BY DESIGN</span><h2>Your personal details deserve serious protection.</h2></div><p>VitaPath is being designed with managed authentication, per-user data access and layered protection. Sensitive account features will only be enabled with the proper backend security in place.</p></section>
    <footer><div className="footerBrand"><img src="/VitaPath/logo.png" alt="VitaPath"/><span><b>VitaPath</b><small>Build Your Path. Present Your Best.</small></span></div><p>Career and application tools for a global audience.</p><span>© 2026 VitaPath</span></footer>
  </main>
}