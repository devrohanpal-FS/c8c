# Technical Implementation Plan — 10-Day MVP Sprint

Project: AI Health & Diet Planner
Target: production-deployable MVP in 10 calendar days — **an aggressive target, not a guarantee.** Subject to feasibility, verified capacity, passing acceptance tests and explicit CTO approvals.

Governance: Antigravity is Engineering Lead; the CTO (Rohan) holds final approval. Implementation starts only after the CTO approves scope and milestone plan. No silent scope expansion; material architecture/DB/API/security/dependency/deployment changes need authorization.

## 1. Agents & Responsibilities

| Agent | Role | Evidence expected |
|---|---|---|
| Manish — Discovery | Requirements, architecture, acceptance criteria | Approved PRD/SRS, architecture, milestone plan |
| Sanjeev — Development | Frontend, backend, DB, AI, payments | Working implementation, test results |
| Panday Omkar — Security | Threat model, authn/authz, privacy review | Findings and verified remediation |
| Ajay — QA | Unit, integration, regression, E2E | Reproducible test reports |
| Narender — DevOps | Docker, CI/CD, deployment, monitoring | Build/deploy verification |

Every agent report: assigned, completed, pending, blockers, test evidence, deviations from scope, next actions. Login/logout times only if backed by verified runtime logs; otherwise marked "unavailable".

## 2. Day-by-Day Plan

### Day 1 — Discovery & Architecture Freeze (Manish)
- Repository inspection; read governance files.
- Finalize PRD, SRS, architecture, API, DB design, security and test strategy, deployment plan, 10-day plan.
- Freeze MVP scope; define acceptance criteria per milestone.
- **Gate:** CTO approves requirements and architecture.
- Parallel: Security drafts threat model; QA drafts acceptance scenarios; DevOps confirms deployment requirements; Dev prepares breakdown (no implementation before approval).

### Day 2 — Foundation (Sanjeev; support Narender, Ajay)
- Repo/env setup, frontend/backend skeleton, PostgreSQL + Prisma, migrations, auth, app shell, CI skeleton.
- **Done when:** user can register/login; CI runs build + tests.

### Day 3 — Health Profile (Sanjeev; support Manish, Ajay)
- Onboarding flow; age, height, weight, activity; diet preference; allergies/exclusions; goal; budget; validation and medical-flag handling.
- **Done when:** user can create and update a validated profile.

### Day 4 — Nutrition Engine (Sanjeev; review Manish, Panday Omkar, Ajay)
- BMI, BMR (Mifflin-St Jeor), TDEE, goal-based calorie target with safe limits, macro split.
- Verified food database schema, seed, search.
- **Done when:** calculations covered by automated tests; assumptions documented. Not dependent on AI.

### Day 5 — AI Diet Plan Generator (Sanjeev; support Manish, Ajay)
- AI provider adapter; prompt + strict JSON schema; 7-day plan with 4 meal types; Indian foods; veg/non-veg; budget-aware.
- Validation against food DB; allergy/exclusion checks; alternatives; error handling and retries.
- **Done when:** user generates a validated plan; unverified data flagged, not fabricated.

### Day 6 — Dashboard & Tracking (Sanjeev; support Ajay)
- Dashboard, plan view, daily meal logging, calorie/protein totals, weight history chart, grocery list.
- **Done when:** user follows plan and records progress.

### Day 7 — Subscriptions & Payments (Sanjeev; support Panday Omkar, Ajay)
- Free/Premium plans, pricing page, checkout, webhook verification, subscription status, server-side premium gating, cancel/renewal.
- **Done when:** verified test payment unlocks premium; failure scenarios handled.

### Day 8 — Security & Integration Testing (Panday Omkar; QA Ajay; Dev Sanjeev)
- Authn/authz, data isolation, input validation, dependency audit, premium bypass, webhook forgery, AI safety; full regression; fix critical bugs.
- **Done when:** security findings and regression report issued; no open critical items.

### Day 9 — Deployment Rehearsal (Narender; support Sanjeev, Ajay, Panday Omkar)
- Production build, env validation, migration rehearsal, pipeline, HTTPS, logging/monitoring, smoke tests, backup/restore verification, rollback drill.
- **Done when:** deployment-ready build and documented procedure.

### Day 10 — Final Acceptance & Launch (Antigravity; all agents verify; CTO final)
- E2E journeys, payment flow, security blockers closed, production migration verified, checklist complete, acceptance report, explicit CTO approval, production release, post-deploy smoke tests.

## 3. Critical Path

Architecture approval → foundation/auth → profile → nutrition engine → AI plan generator → payments gating → security/regression → deployment rehearsal → release.

Parallelizable: Admin basics, UI polish, grocery list, tests authoring, CI/CD, monitoring setup, docs.

## 4. Scope Control & Fallbacks

If behind schedule, defer in this order (CTO to confirm): advanced admin → renewal/cancellation edge cases → food alternatives → grocery list → budget optimization depth. Never defer: auth, data isolation, nutrition tests, payment verification, security gate, backups.

## 5. Risks

| Risk | Mitigation |
|---|---|
| Unrealistic 10-day capacity | Verify capacity Day 1–2; defer features early |
| AI output quality/cost | Schema validation, DB cross-check, quotas, provider cap |
| Food data coverage (Indian foods) | Curated verified seed dataset; flag unknowns |
| Payment integration delays | Early sandbox access; start provider onboarding Day 1 |
| Health/regulatory exposure | No diagnosis scope; disclaimers; legal review |
| Late security findings | Threat model Day 1, review Day 4/7, audit Day 8 |

## 6. Required CTO Decisions

1. Approve MVP scope and milestone plan.
2. Payment provider and pricing.
3. AI provider and monthly budget.
4. Hosting target and domain.
5. Compliance/legal posture for health data.
6. Final production release approval.

## 7. Definition of Done (Release)

Build and type-checks pass; migrations verified; auth/authz working; nutrition tests pass; AI validated; payments verified; premium enforced server-side; cross-user access blocked; regression green; zero unresolved critical security findings; deployment smoke tests pass; monitoring works; deployment and recovery docs available. Nothing is claimed implemented, tested or deployed without verification evidence.
