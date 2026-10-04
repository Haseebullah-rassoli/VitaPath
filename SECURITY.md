# Security
Never commit CV data, passwords, service-role keys, private keys, or production environment files.

## Architecture
- Supabase Auth handles passwords and sessions; VitaPath does not implement password storage.
- PostgreSQL Row Level Security restricts profile rows to the authenticated owner.
- Browser code uses only the publishable/anon key. Never expose the service-role key.
- Cloudflare should be configured at deployment for TLS, WAF/rate limiting and bot protection.

Before production: enable email verification, MFA where appropriate, breached-password protection if available, CAPTCHA/Turnstile on abusive auth flows, security headers, audit logging, backups, and dependency scanning.
