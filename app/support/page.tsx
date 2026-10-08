"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Header, Footer } from "../../components/shell";
import { Icon } from "../../components/icon";
import { createClient } from "../../lib/supabase/client";
import { faqs, requestCategories, statusLabels, type SupportRequest } from "../../lib/support";
export default function Support() {
  const [search,setSearch]=useState("");
  const [group,setGroup]=useState("All topics");
  const [requests,setRequests]=useState<SupportRequest[]>([]);
  const [signed,setSigned]=useState(false);
  const [busy,setBusy]=useState(true);
  const [error,setError]=useState("");
  const generation=useRef(0);
  async function loadRequests(){
    const version=++generation.current;
    setBusy(true);setError("");
    try{
      const client=createClient();
      const {data:{user},error:authError}=await client.auth.getUser();
      if(version!==generation.current)return;
      if(authError&&authError.name!=="AuthSessionMissingError")throw authError;
      setSigned(!!user);
      if(!user){setRequests([]);return;}
      const {data,error}=await client.from("support_requests").select("id,category,subject,message,status,admin_reply,created_at,updated_at").eq("user_id",user.id).order("created_at",{ascending:false}).limit(50);
      if(error)throw error;
      if(version===generation.current)setRequests((data||[]) as SupportRequest[]);
    }catch{if(version===generation.current)setError("Your requests could not be loaded. Please try again.");}
    finally{if(version===generation.current)setBusy(false);}
  }
  useEffect(()=>{loadRequests();const {data}=createClient().auth.onAuthStateChange(event=>{if(event==="SIGNED_OUT"){generation.current++;setRequests([]);setSigned(false);setBusy(false);}});return()=>{generation.current++;data.subscription.unsubscribe();};},[]);
  const visible=faqs.filter(f=>(group==="All topics"||f.group===group)&&`${f.title} ${f.answer}`.toLowerCase().includes(search.toLowerCase()));
  return <><Header/><main id="main" className="container service-page support-page">
    <div className="page-heading"><span className="eyebrow">THE SUPPORT CENTRE</span><h1>A little guidance.<br/><em>A clear next step.</em></h1><p>Practical answers for your account, documents, and applications.</p></div>
    <label className="support-search"><Icon name="search" size={23}/><input type="search" aria-label="Search help articles" placeholder="Try “PDF”, “password”, or “saved drafts”…" value={search} onChange={e=>setSearch(e.target.value)}/></label>
    <div className="support-shortcuts"><Link href="/signup"><Icon name="shield"/><span><b>Account help</b>Create, confirm, and sign in</span><Icon name="arrow" size={18}/></Link><Link href="/guides"><Icon name="book"/><span><b>Writing guidance</b>Make your experience clear</span><Icon name="arrow" size={18}/></Link><Link href="/contact"><Icon name="mail"/><span><b>Contact support</b>Send a private request</span><Icon name="arrow" size={18}/></Link></div>
    <section className="help-section"><div className="section-heading"><h2>Common questions</h2><span className="quiet">{visible.length} helpful answers</span></div><div className="filter-tabs">{["All topics","Account","Documents","Templates","Plans","Privacy"].map(x=><button key={x} aria-pressed={group===x} className={group===x?"selected":""} onClick={()=>setGroup(x)}>{x}</button>)}</div><div className="help-articles">{visible.map(f=><details key={f.title} className="help-article"><summary><span>{f.title}</span><Icon name="plus" size={18}/></summary><div><p>{f.answer}</p><Link href={f.href} className="text-link">{f.link} <Icon name="arrow" size={15}/></Link></div></details>)}{!visible.length&&<div className="empty-state"><h3>No matching answers yet.</h3><p>Try another word or send us a message.</p><Link href="/contact" className="button secondary">Contact support</Link></div>}</div></section>
    <section id="requests" className="support-requests"><div className="section-heading"><div><span className="eyebrow">YOUR CONVERSATIONS</span><h2>My requests</h2></div><button className="button secondary small" disabled={busy} onClick={loadRequests}>{busy?"Loading…":"Refresh"}</button></div>
      {error&&<div className="notice error" role="alert">{error}</div>}
      {busy?<p role="status">Loading your requests…</p>:!signed?<div className="account-prompt"><Icon name="cloud" size={28}/><div><h3>Keep your requests in one place.</h3><p>Sign in before sending a message to track its status and read replies here.</p></div><Link href="/login?next=%2Fsupport" className="button small">Sign in</Link></div>:requests.length?<><p className="quiet">Your {requests.length===50?"50 most recent":"recent"} account requests. Refresh to check for replies.</p><div className="request-list">{requests.map(r=><details key={r.id} className="request-card"><summary><span><small>{requestCategories[r.category]} · {new Date(r.created_at).toLocaleDateString()}</small><b>{r.subject}</b></span><span className={`request-status status-${r.status}`}>{statusLabels[r.status]}</span></summary><div className="request-content"><p className="request-message">{r.message}</p><p className="quiet">Reference: <code>{r.id}</code></p>{r.admin_reply?<div className="support-reply"><b>VitaPath reply</b><p>{r.admin_reply}</p></div>:<p className="quiet">No reply yet. Response times vary.</p>}</div></details>)}</div></>:<div className="empty-state"><Icon name="mail" size={30}/><h3>No account requests yet.</h3><p>Messages you send while signed in will appear here.</p><Link href="/contact" className="button secondary">Send a message</Link></div>}
    </section>
    <div className="service-bottom"><Icon name="mail" size={30}/><div><h2>Still need a hand?</h2><p>You can contact us even if you cannot sign in.</p></div><Link href="/contact" className="button">Contact support <Icon name="arrow" size={17}/></Link></div>
  </main><Footer/></>;
}
