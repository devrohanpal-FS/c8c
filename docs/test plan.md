# Test Plan — AI Health & Diet Planner (MVP)

Owner: Ajay (QA). Status: **Proposed.** Nothing is reported as passing without reproducible evidence (command output, CI run, report).

## 1. Objectives

Verify the MVP is correct, secure, and deployable; identify release blockers; prevent regressions across the 10-day sprint.

## 2. Scope

In scope: auth, health profile, nutrition engine, AI meal plans, tracking, subscriptions/payments, admin basics, responsive UI, deployment smoke.
Out of scope: medical accuracy certification, load testing beyond basic checks, native apps.

## 3. Test Levels & Tools (proposed)

| Level | Tool | Focus |
|---|---|---|
| Unit | Vitest/Jest | Nutrition formulas, validators, entitlement logic, AI output validator |
| Integration | Vitest/Jest + Supertest + test DB | API endpoints, DB, authz, webhooks |
| E2E | Playwright | Critical user journeys, mobile viewport |
| Security | Manual + scripts + dependency/container scan | See `Security.md` |
| Static | ESLint, TypeScript `tsc --noEmit` | Quality gates |
| Smoke | Scripted against staging/prod | Post-deploy checks |

External services (AI, payment) are mocked in automated tests; sandbox/test-mode runs executed separately.

## 4. Unit Test Highlights

- BMI: boundary values (underweight/normal/overweight/obese), invalid input.
- BMR/TDEE: reference cases for male/female, activity multipliers, known expected values.
- Calorie targets: weight loss/gain/maintenance; safety floor/ceiling enforced.
- Macro split sums to target calories within tolerance.
- Entitlement logic: Free vs Premium limits, expired/canceled states.
- AI validator: rejects schema violations, allergens, excluded foods, out-of-range calories; flags unverified foods.

## 5. Integration Test Highlights

- Auth: register (duplicate email → 409), login failure, token refresh/rotation, logout revocation, password reset.
- Profile: create/update, validation errors, medical-flag path returns advisory not plan.
- Meal plans: generate (mocked AI), quota enforcement, plan persistence, 404 for other users' plans.
- Tracking: log/delete meals, daily totals, weight log uniqueness per day.
- Payments: valid signed webhook grants premium; invalid signature rejected; duplicate event idempotent; failed/refunded/expired handled.
- Admin: non-admin gets 403.

## 6. Critical E2E Journeys

1. Register → onboarding profile → see nutrition summary.
2. Generate 7-day plan → view meals → alternatives (Premium) → grocery list.
3. Log meals for a day → see calorie/protein totals.
4. Add weight entries → see progress chart.
5. Upgrade to Premium (test mode) → premium features unlock → cancel.
6. Free user hits premium feature/limit → blocked with upgrade prompt.
7. Mobile viewport run of journeys 1–3.

## 7. Authorization & Data Isolation Matrix

For every user-owned endpoint: User A cannot read, update or delete User B's data (expect 404/403). Unauthenticated → 401. Non-admin on admin routes → 403. Client-tampered premium flags ignored.

## 8. AI-Specific Tests

- Vegetarian profile never receives non-veg items; allergens never appear.
- Budget respected within tolerance; calories within ±10% of target (configurable).
- Malformed/empty/timeout AI responses → graceful error, no partial fabricated plan.
- Prompt-injection strings in profile fields do not alter behavior.
- Repeated generation respects rate limits and quotas.

## 9. Non-Functional Checks

- Performance smoke: API p95 < 500 ms on core endpoints (excluding AI) under light load.
- Accessibility: keyboard navigation, labels, contrast on key pages.
- Browser/device: latest Chrome, Safari, Firefox; Android/iOS mobile viewports.
- Resilience: DB reconnect, AI provider failure, webhook retry.

## 10. Regression Strategy

Automated suite runs on every PR (unit + integration) and nightly/pre-release (E2E). Each bug fix adds a regression test. Full regression executed Day 8 and again on the release candidate (Day 10).

## 11. Entry / Exit Criteria

Entry per milestone: acceptance criteria defined; build green.
Exit for release:
- All unit/integration/E2E critical tests pass.
- Zero open Critical/High defects; Medium defects have CTO-accepted risk.
- Security checklist complete (`Security.md`).
- Payment test scenarios pass (success, failure, duplicate, forged).
- Staging smoke tests pass; backup restore verified.

## 12. Defect Management

Severity: **Critical** (data leak, auth/payment bypass, data loss, app down) / **High** (core flow broken) / **Medium** / **Low**. Each report: steps, expected vs actual, environment, evidence. Critical/High block release.

## 13. Smoke Test (Post-Deploy)

Health endpoint OK → register/login → save profile → generate plan → log meal → pricing page loads → test payment flow (staging) → logs/monitoring receive events.

## 14. Reporting

Daily QA report: tests added/executed/passed/failed, open defects by severity, blockers, evidence links, deviations, next actions. Final acceptance report on Day 10 for CTO sign-off.
