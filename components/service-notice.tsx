"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Icon } from "./icon";

export function ServiceNotice() {
  const [dismissed, setDismissed] = useState(false);
  const pathname = usePathname();
  const inBuilder = pathname.replace(/\/$/, "").endsWith("/builder");

  if (dismissed) return null;

  return (
    <aside className="service-notice" aria-label="VitaPath service notice">
      <div className="service-notice-inner">
        <span className="service-notice-icon"><Icon name="info" size={22} /></span>
        <div className="service-notice-copy">
          <strong>We’re improving VitaPath.</strong>
          <p>
            Account creation and sign-in may have temporary issues while we work on improvements.
            You can still create and download your CV or resume without an account.
          </p>
        </div>
        {!inBuilder && (
          <Link href="/builder" className="button small service-notice-action">
            Create without an account <Icon name="arrow" size={16} />
          </Link>
        )}
        <button
          type="button"
          className="service-notice-dismiss"
          aria-label="Dismiss service notice"
          onClick={() => setDismissed(true)}
        >
          <Icon name="close" size={19} />
        </button>
      </div>
    </aside>
  );
}
