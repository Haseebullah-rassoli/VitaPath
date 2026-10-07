"use client";
import {useEffect,useState} from "react";
import Link from "next/link";

type Resume={name:string,title:string,email:string,phone:string,location:string,summary:string,education:string,experience:string,skills:string};
const blank:Resume={name:"",title:"",email:"",phone:"",location:"",summary:"",education:"",experience:"",skills:""};

export default function Builder(){
 const [r,setR]=useState<Resume>(blank);
 const [ready,setReady]=useState(false);
 useEffect(()=>{try{const s=localStorage.getItem("vitapath_resume");if(s)setR(JSON.parse(s))}catch{}setReady(true)},[]);
 useEffect(()=>{if(ready)localStorage.setItem("vitapath_resume",JSON.stringify(r))},[r,ready]);
 const set=(k:keyof Resume,v:string)=>setR(x=>({...x,[k]:v}));
 return <main className="builderPage">
  <header className="builderHeader"><Link href="/" className="builderBrand"><img src="/VitaPath/logo.png" alt="VitaPath"/><b>VitaPath</b></Link><span>Resume Builder</span><button onClick={()=>window.print()}>Download / Print PDF</button></header>
  <div className="builderShell">
   <section className="editor">
    <div className="editorIntro"><span>STEP 1 · YOUR INFORMATION</span><h1>Build your resume</h1><p>Fill in the fields and see your resume update instantly. Your draft is saved only in this browser for now.</p></div>
    <div className="formGrid">
     <label>Full name<input value={r.name} onChange={e=>set("name",e.target.value)} placeholder="Alex Johnson"/></label>
     <label>Professional title<input value={r.title} onChange={e=>set("title",e.target.value)} placeholder="Computer Science Student"/></label>
     <label>Email<input type="email" value={r.email} onChange={e=>set("email",e.target.value)} placeholder="alex@example.com"/></label>
     <label>Phone<input value={r.phone} onChange={e=>set("phone",e.target.value)} placeholder="+00 000 000 000"/></label>
     <label className="wide">Location<input value={r.location} onChange={e=>set("location",e.target.value)} placeholder="City, Country"/></label>
     <label className="wide">Professional summary<textarea value={r.summary} onChange={e=>set("summary",e.target.value)} placeholder="Write 2–4 concise sentences about your background, strengths and goals."/></label>
     <label className="wide">Education<textarea value={r.education} onChange={e=>set("education",e.target.value)} placeholder={"Degree / Program — School or University\n2024–2028 · City, Country"}/></label>
     <label className="wide">Experience / Volunteering<textarea value={r.experience} onChange={e=>set("experience",e.target.value)} placeholder={"Role — Organization\n2025–Present\n• Achievement or responsibility"}/></label>
     <label className="wide">Skills<input value={r.skills} onChange={e=>set("skills",e.target.value)} placeholder="Communication, Python, Cybersecurity, English"/></label>
    </div>
    <div className="builderNote">This first live builder works without an account. Cloud saving and secure accounts will be enabled after the production backend is connected.</div>
   </section>
   <section className="previewWrap"><div className="previewLabel">LIVE PREVIEW · ATS-FRIENDLY</div><article className="resume">
    <header><h2>{r.name||"Your Name"}</h2><h3>{r.title||"Professional Title"}</h3><p>{[r.email,r.phone,r.location].filter(Boolean).join("  ·  ")||"email@example.com  ·  +00 000 000 000  ·  City, Country"}</p></header>
    <ResumeSection title="Profile" value={r.summary} fallback="A concise professional summary will appear here."/>
    <ResumeSection title="Education" value={r.education} fallback="Your education details will appear here."/>
    <ResumeSection title="Experience & Volunteering" value={r.experience} fallback="Your experience, projects or volunteering will appear here."/>
    <ResumeSection title="Skills" value={r.skills} fallback="Your key skills will appear here."/>
   </article></section>
  </div>
 </main>
}
function ResumeSection({title,value,fallback}:{title:string,value:string,fallback:string}){return <section className="resumeSection"><h4>{title}</h4><p className={!value?"placeholder":""}>{value||fallback}</p></section>}
