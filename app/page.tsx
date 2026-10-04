const tools = [
  ["European CV", "Create a clean CV for European study and career applications."],
  ["Scholarship CV", "Present education, leadership, volunteering and achievements."],
  ["Motivation Letter", "Structure a focused scholarship or university motivation letter."],
  ["Recommendation Letter", "Prepare a professional draft for a recommender to review and sign."],
  ["GCC Resume + Cover Letter", "Build job-focused documents for Gulf opportunities."],
];

export default function Home() {
  return (
    <main>
      <nav><strong>VitaPath</strong><div><a href="#security">Security</a><button>Sign in</button></div></nav>
      <section className="hero">
        <span className="eyebrow">PRIVACY-FIRST CAREER DOCUMENTS</span>
        <h1>Build your path.<br/>Present your best.</h1>
        <p>One secure profile. Multiple professional documents for Europe, scholarships and GCC careers.</p>
        <button className="primary">Create your documents</button>
      </section>
      <section className="grid">
        {tools.map(([title, text], i) => <article key={title}><span>0{i+1}</span><h2>{title}</h2><p>{text}</p><a href="#">Start →</a></article>)}
      </section>
      <section id="security" className="security"><div><span className="eyebrow">DESIGNED AROUND PRIVACY</span><h2>Your personal details deserve serious protection.</h2></div><p>VitaPath is being designed with managed authentication, protected user data, secure sessions, strict access controls and layered edge protection. We collect only what the document builder needs.</p></section>
      <footer>VitaPath · Build Your Path. Present Your Best.</footer>
    </main>
  );
}
