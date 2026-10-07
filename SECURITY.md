# Security

Never commit CV data, passwords, private credentials, service-role keys, or SMTP passwords. The Supabase publishable key is intentionally available to the browser; it is not an authorization boundary.

## Current controls

- Supabase Authentication handles passwords and sessions. Authorization uses `auth.uid()` and never editable user metadata.
- Public document and profile tables have RLS enabled. SELECT/INSERT/UPDATE/DELETE policies restrict ownership; UPDATE has both USING and WITH CHECK.
- Anonymous table privileges are revoked. Authenticated users have only the required row operations; TRUNCATE, TRIGGER, and REFERENCES are not granted.
- Privileged signup code lives in a private schema, has a fixed search path, and is not directly callable by browser roles.
- Document content and titles are constrained. React renders text without raw HTML. Imports allow only known fields and reject unsupported backups.
- Cloud saves compare the server timestamp to detect concurrent edits. Sessions and documents are cleared from the dashboard UI on sign-out.
- Dependencies are pinned, lockfile committed, fonts served locally. The application adds no analytics or AI document processing.

## Operational limitations

GitHub Pages controls HTTP response headers; this static repository does not claim to configure a WAF, server rate limiting, CSP response headers, or infrastructure backups. Supabase manages authentication rate limits and service security. Verify production email delivery and allowed redirects as described in README before announcing public registration.

Browser local storage is not private from another person using that browser profile. Signing out does not delete separate browser drafts. Account documents are not end-to-end encrypted; project administrators can administer the database. Be explicit about these limits in user-facing privacy information.

For future changes, run Supabase security advisors and transactionally test cross-user read, write, ownership transfer, and deletion. Never test against or print real users' document contents. Do not expose secrets or personal data in public issue reports.
