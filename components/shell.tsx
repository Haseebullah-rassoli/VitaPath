"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client";
import { Icon } from "./icon";
export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="VitaPath home">
      <span className="brand-mark">
        <svg viewBox="0 0 40 44" fill="none" aria-hidden="true">
          <path
            d="m6 13 14 4 14-4v12c0 8-14 15-14 15S6 33 6 25Z"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="m8 4 5 5 7-7 7 7 5-5-2 9H10Z" fill="currentColor" />
          <path
            d="m12 21v9m0-4h6m0-5v9m5 0v-9h3c4 0 4 5 0 5h-3m3 0 4 4"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </span>
      <span>
        Vita<span className="brand-light">Path</span>
        <small>YOUR NEXT CHAPTER</small>
      </span>
    </Link>
  );
}
export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [signed, setSigned] = useState(false);
  useEffect(() => {
    const client = createClient();
    client.auth.getSession().then(({ data }) => setSigned(!!data.session));
    const { data } = client.auth.onAuthStateChange((_event, session) =>
      setSigned(!!session),
    );
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => setOpen(false), [path]);
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <div className="nav-inner">
          <Brand />
          <nav
            className={open ? "nav-links open" : "nav-links"}
            aria-label="Main navigation"
          >
            {[
              ["/templates", "Templates"],
              ["/builder", "Resume builder"],
              ["/guides", "Writing guides"],
              ["/dashboard", "My documents"],
            ].map(([href, label]) => (
              <Link
                href={href}
                key={href}
                className={path === href ? "active" : ""}
                aria-current={path === href ? "page" : undefined}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="nav-actions">
            <span className="language">
              <Icon name="globe" size={15} /> EN
            </span>
            <Link
              className="nav-signin"
              href={signed ? "/dashboard" : "/login"}
            >
              {signed ? "My account" : "Sign in"}
            </Link>
            <Link className="button small" href="/builder">
              Get started <Icon name="arrow" size={16} />
            </Link>
            <button
              className="menu-button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              <Icon name={open ? "close" : "menu"} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <Brand />
          <p>
            Thoughtful documents.
            <br />A world of possibilities.
          </p>
        </div>
        <div>
          <b>CREATE</b>
          <Link href="/builder">Resume & CV</Link>
          <Link href="/builder?template=scholar">Scholarship CV</Link>
          <Link href="/templates?category=Letters">Application letters</Link>
        </div>
        <div>
          <b>EXPLORE</b>
          <Link href="/templates">All templates</Link>
          <Link href="/guides">Writing guides</Link>
          <Link href="/dashboard">My documents</Link>
        </div>
        <div>
          <b>VITAPATH</b>
          <Link href="/privacy">Privacy & your data</Link>
          <Link href="/login?mode=signup">Create an account</Link>
          <span>Built by Haseebullah Rassoli</span>
        </div>
      </div>
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} VitaPath. Build your path. Present your
          best.
        </span>
        <span>
          Made for your next chapter <Icon name="globe" size={16} />
        </span>
      </div>
    </footer>
  );
}
