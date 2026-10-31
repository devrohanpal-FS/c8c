# Deployment Plan — AI Health & Diet Planner (MVP)

Owner: Narender (DevOps). Status: **Proposed — hosting and provider choices need CTO approval.** Production release requires explicit CTO approval.

## 1. Environments

| Environment | Purpose | Data |
|---|---|---|
| local | Development (Docker Compose: app + Postgres) | Seed/fake |
| staging | Integration, QA, deployment rehearsal | Anonymized/test only |
| production | Live users | Real |

Payment provider runs in **test mode** in local/staging; live keys only in production.

## 2. Build & Packaging

- Dockerfile: multi-stage build, non-root user, minimal runtime image, pinned versions.
- `docker-compose.yml` for local; production via container on VPS or managed platform (CTO decision).
- Build must pass: install → lint → type-check → unit/integration tests → production build.

## 3. CI/CD (GitHub Actions)

1. On PR: lint, type-check, unit + integration tests, dependency audit.
2. On merge to `main`: build image, push to registry, deploy to staging, run smoke tests.
3. Production: manual approval gate (CTO) → deploy → smoke tests → auto-rollback on failure.

Secrets live in the CI/secret store, never in the repo.

## 4. Configuration & Secrets

Required environment variables (validated at startup; app fails fast if missing):

`DATABASE_URL`, `JWT_SECRET` / key pair, `REFRESH_TOKEN_SECRET`, `AI_PROVIDER_API_KEY`, `PAYMENT_KEY_ID`, `PAYMENT_KEY_SECRET`, `PAYMENT_WEBHOOK_SECRET`, `APP_URL`, `NODE_ENV`, `SENTRY_DSN` (or equivalent), `SMTP_*` for email.

Separate secrets per environment; rotation procedure documented.

## 5. Database Migrations

- Run `prisma migrate deploy` as a release step before app start.
- Rehearse on staging using a production-like snapshot on Day 9.
- Migrations must be backward compatible with the previous app version to allow rollback.
- Take a backup immediately before production migration.

## 6. Networking & HTTPS

- Domain + DNS configured; TLS certificates (Let's Encrypt or platform-managed), HTTPS enforced, HSTS enabled.
- Reverse proxy (Nginx/Caddy) with security headers and request size limits.
- Database not publicly exposed; access only from app network/VPN.

## 7. Monitoring & Logging

- Structured JSON logs (no passwords, tokens, or health data).
- Error tracking (Sentry or equivalent) with alerting.
- Uptime check on `/api/health`; alerts on downtime, error spikes, payment webhook failures, AI provider failures.
- Basic metrics: request rate, latency, error rate, DB connections.

## 8. Backup & Recovery

- Automated daily PostgreSQL backups, retained 14–30 days, stored off-host.
- Restore tested on staging before launch; document RPO/RTO targets (initial: RPO ≤ 24 h, RTO ≤ 4 h).
- Recovery runbook included in repo.

## 9. Rollback

- Keep previous image tag; rollback = redeploy previous tag.
- If a migration is not reversible, restore from the pre-migration backup (documented decision tree).

## 10. Release Checklist (Day 9–10)

- [ ] Production build succeeds; type-checks pass
- [ ] Env vars validated in production
- [ ] Migrations verified on staging; backup taken
- [ ] HTTPS and security headers verified
- [ ] Smoke tests pass (register, login, profile, generate plan, log meal, payment test flow)
- [ ] Payment webhook verified end-to-end in provider test mode, then live config checked
- [ ] Monitoring and alerts firing correctly (test alert)
- [ ] Backup restore verified
- [ ] No unresolved critical security findings (`Security.md`)
- [ ] Deployment and recovery documentation complete
- [ ] **CTO explicit production approval recorded**

## 11. Open Decisions for CTO

Hosting target (VPS vs managed), payment provider, AI provider and budget, domain/DNS ownership, email provider.
