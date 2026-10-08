"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { createClient } from "../lib/supabase/client";
import { Icon } from "./icon";
import { requestCategories, requestCategory, type RequestCategory } from "../lib/support";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState<RequestCategory>("general");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState("");
  const requestId = useRef("");
  useEffect(() => {
    const choice = requestCategory(new URLSearchParams(location.search).get("category"));
    setCategory(choice);
    if (choice === "premium") setSubject("I’m interested in VitaPath Premium");
    let alive = true;
    createClient().auth.getUser().then(({ data }) => {
      if (!alive || !data.user) return;
      setUserId(data.user.id);
      setEmail(data.user.email || "");
      setName(String(data.user.user_metadata.full_name || "").slice(0, 120));
    });
    return () => { alive = false; };
  }, []);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setError("");
    if (website) { setError("Please leave the website field empty."); return; }
    if (name.trim().length < 2 || subject.trim().length < 5 || message.trim().length < 20) {
      setError("Add your name, a subject of at least 5 characters, and a message of at least 20 characters."); return;
    }
    setBusy(true);
    try {
      const client = createClient();
      const { data } = await client.auth.getUser();
      const owner = data.user?.id || null;
      setUserId(owner);
      requestId.current ||= crypto.randomUUID();
      const { error } = await client.from("support_requests").insert({
        id: requestId.current, user_id: owner, name: name.trim(), email: email.trim().toLowerCase(), category, subject: subject.trim(), message: message.trim(),
      });
      if (error) throw error;
      setReceipt(requestId.current);
    } catch (e) {
      const value = e as { message?: string; code?: string };
      if (value.code === "23505") setReceipt(requestId.current);
      else if (value.message?.includes("request limit")) setError("You have sent several requests recently. Please wait an hour before sending another.");
      else if (value.message?.includes("temporarily busy")) setError("Support submissions are temporarily busy. Please try again later.");
      else setError("Your message could not be saved. Your text is still here; please check your connection and try again.");
    } finally { setBusy(false); }
  }
  if (receipt) return <div className="contact-success" role="status">
    <span className="success-symbol"><Icon name="check" size={30} /></span>
    <h2>{category === "premium" ? "Your interest is registered." : "Your message is saved."}</h2>
    <p>{category === "premium" ? "This is an interest request. No payment has been taken, and no subscription has started." : "Thank you for explaining what you need. Keep your reference number for any follow-up."}</p>
    <label>Request reference<code className="request-reference">{receipt}</code></label>
    <p>{userId ? "You can view this request and any reply in your Support centre." : "The team can use the email you supplied to reply. This request was sent without an account, so it will not appear in an account’s request history."}</p>
    <p className="quiet">Response times vary. A confirmation email is not sent automatically.</p>
    <Link href={userId ? "/support#requests" : "/support"} className="button">Open Support <Icon name="arrow" size={17} /></Link>
  </div>;
  return <form className="contact-form" onSubmit={submit}>
    <div className="contact-form-heading"><h2>Send a message</h2><p>Tell us what happened and how we can help.</p></div>
    {userId && <div className="notice">This request will be linked to your account.</div>}
    {error && <div className="notice error" role="alert">{error}</div>}
    <div className="form-grid">
      <label>Your name<input required minLength={2} maxLength={120} autoComplete="name" value={name} onChange={e=>setName(e.target.value)} /></label>
      <label>Email address<input required type="email" maxLength={254} autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} /></label>
      <label className="wide">What can we help with?<select value={category} onChange={e=>setCategory(requestCategory(e.target.value))}>{Object.entries(requestCategories).map(([id,label])=><option key={id} value={id}>{label}</option>)}</select></label>
      <label className="wide">Subject<input required minLength={5} maxLength={160} value={subject} onChange={e=>setSubject(e.target.value)} /></label>
      <label className="wide">Your message<textarea required minLength={20} maxLength={5000} rows={7} value={message} onChange={e=>setMessage(e.target.value)} placeholder={category === "premium" ? "Which Premium features would be useful to you?" : "What were you trying to do? What happened? Include your browser or device if relevant."}/><small>{message.length.toLocaleString()} / 5,000 characters</small></label>
      <label className="contact-trap" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={website} onChange={e=>setWebsite(e.target.value)}/></label>
    </div>
    <label className="consent-line"><input required type="checkbox"/><span>I agree that VitaPath may use these details to handle this request, as described in the <Link href="/privacy">privacy information</Link>.</span></label>
    <button className="button full" disabled={busy}>{busy ? "Saving your message…" : category === "premium" ? "Register Premium interest" : "Send message"}<Icon name="arrow" size={17}/></button>
    <p className="quiet">Please leave passwords, payment details, and private documents out of your message.</p>
  </form>;
}
