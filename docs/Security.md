# Security & Privacy — AI Health & Diet Planner (MVP)

Owner: Panday Omkar (Security). Status: **Proposed baseline.** Release gate: **zero unresolved critical findings.**

## 1. Assets & Trust Boundaries

Assets: user credentials, health profile data (age, height, weight, goals, allergies), meal/weight logs, subscription and payment records, API keys (AI, payment).
Boundaries: browser ↔ app, app ↔ database, app ↔ AI provider, app ↔ payment provider, admin ↔ system.

## 2. Authentication

- Passwords hashed with argon2id (or bcrypt cost ≥ 12); minimum length and common-password check.
- Short-lived access tokens (~15 min), rotating refresh tokens stored hashed, revocable on logout/password change.
- Cookies: `HttpOnly`, `Secure`, `SameSite=Lax/Strict`; CSRF protection for cookie-based flows.
- Login throttling and lockout/backoff; generic error messages (no user enumeration).
- Password reset tokens: single-use, short expiry, stored hashed.

## 3. Authorization

- Role-based (USER, ADMIN); admin routes protected server-side.
- **User data isolation:** every user-owned query filtered by authenticated user id; access to another user's resource returns 404.
- **Premium enforcement server-side** from subscription status; client flags are never trusted.
- Tests required for cross-user access (IDOR) on every user-owned endpoint.

## 4. Input & API Security

- Schema validation on all inputs; reject unknown fields; bounds on numerics and string lengths.
- Parameterized queries via Prisma; no raw SQL with user input.
- Output encoding / React escaping; no `dangerouslySetInnerHTML` with user or AI content.
- Rate limiting (auth, AI generation, general); request body size limits.
- CORS restricted to the application origin.
- Security headers: CSP, HSTS, X-Content-Type-Options, X-Frame-Options/frame-ancestors, Referrer-Policy.

## 5. Health-Data Privacy

- Collect minimum necessary data; explicit consent and privacy policy at onboarding.
- Encryption in transit (TLS) and at rest (database/disk encryption); encrypted backups.
- No health data, tokens or passwords in logs or error tracking payloads (scrub).
- Do not send names, emails or identifiers to the AI provider; send only the fields needed for planning.
- Account deletion and data export capability (design in MVP, implement as scoped by CTO).
- Compliance review needed for applicable law (e.g. India DPDP Act; others if serving other regions). **CTO/legal decision required.**

## 6. AI-Specific Risks

| Risk | Mitigation |
|---|---|
| Unsafe/medical advice | Scope excludes diagnosis/therapeutic diets; disclaimers; medical-flag users get advisory only |
| Hallucinated nutrition data | Validate against verified food DB; recompute values in code; flag unverified |
| Allergy/exclusion violation | Post-generation check; reject and regenerate |
| Extreme diets (very low calories) | Hard floor/ceiling on calorie targets and rate of weight change |
| Prompt injection via profile free text | Treat user text as data; sanitize; strict output schema; ignore instructions in fields |
| Cost abuse | Per-user quotas and rate limits; provider spend cap |
| Provider outage | Timeouts, retries, graceful error; no fabricated fallback plans |

## 7. Payments

- Never handle raw card data; use provider-hosted checkout.
- Verify webhook signatures; process events idempotently; reconcile amount/currency/plan server-side.
- Grant premium only after verified payment event; handle failed, refunded, and expired states.
- Payment keys only in secret store; separate test/live keys.

## 8. Infrastructure & Supply Chain

- Secrets in secret manager/CI secrets; `.env` never committed; secret scanning in CI.
- Dependency audit (`npm audit` / equivalent) in CI; lockfile committed; pin versions.
- Non-root containers, minimal images, database not publicly reachable, firewall rules.
- Backups encrypted and access-controlled; restore tested.

## 9. Logging, Monitoring, Incident Response

- Audit log for auth events, admin actions, subscription changes.
- Alerts on repeated auth failures, webhook signature failures, error spikes.
- Incident runbook: contain, assess, notify, rotate secrets, post-mortem. Breach notification obligations to be confirmed with legal.

## 10. Day 8 Security Verification Checklist

- [ ] Auth/session tests (expiry, revocation, brute-force protection)
- [ ] Authorization and IDOR tests across all endpoints
- [ ] Premium bypass attempts blocked
- [ ] Input validation / injection tests
- [ ] Webhook forgery and replay tests
- [ ] AI output safety tests (allergens, extreme targets, injection attempts)
- [ ] Dependency and container scan
- [ ] Headers/TLS/cookie flags verified
- [ ] Logs verified free of sensitive data
- [ ] Findings triaged; criticals fixed and re-verified

Severity policy: Critical/High block release; Medium requires documented CTO-accepted risk; Low tracked.
