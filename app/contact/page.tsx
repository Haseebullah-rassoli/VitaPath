import Link from "next/link";
import { Header, Footer } from "../../components/shell";
import { ContactForm } from "../../components/contact-form";
import { Icon } from "../../components/icon";
export default function Contact() {
  return <><Header/><main id="main" className="container service-page">
    <div className="page-heading"><span className="eyebrow">CONTACT VITAPATH</span><h1>A question, an idea.<br/><em>Let’s hear it.</em></h1><p>Get help with your account, share feedback, or tell us what would make your next application easier.</p></div>
    <div className="contact-layout"><aside className="contact-aside">
      <div className="service-card"><span className="tool-icon"><Icon name="book"/></span><h2>Find a quick answer</h2><p>Help with account confirmation, PDF downloads, saved drafts, and templates.</p><Link href="/support" className="text-link">Visit the Support centre <Icon name="arrow" size={16}/></Link></div>
      <div className="service-card"><span className="tool-icon"><Icon name="cloud"/></span><h2>Keep the conversation together</h2><p>Sign in before sending to see your request and any reply in your account.</p><Link href="/login?next=%2Fcontact" className="text-link">Sign in <Icon name="arrow" size={16}/></Link></div>
      <div className="contact-note"><Icon name="shield"/><p>Your message goes to the VitaPath support queue. Documents are never attached automatically. Response times vary.</p></div>
    </aside><ContactForm/></div>
  </main><Footer/></>;
}
