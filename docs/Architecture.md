# Architecture — AI Health & Diet Planner (MVP)

Status: **Proposed — Discovery Agent (Manish) to verify against company governance and engineering standards; CTO approval required.**

## 1. Goals

- Production-deployable MVP in a 10-day sprint, with scope control.
- Reliable core first: auth, profile, deterministic nutrition engine, AI-assisted meal plans, tracking, subscriptions.
- Architecture that supports a future subscription business and later features (see Out of Scope).

## 2. Scope Summary

In scope: auth, health profile, BMI/BMR/TDEE, goals, dietary preferences and budget, 7-day AI meal plan, alternatives, grocery list, meal and weight tracking, Free/Premium plans, payments, basic admin, responsive web.

Out of scope (MVP): medical report interpretation, disease-specific therapeutic diets, native mobile apps, live doctor consultation, wearables, computer-vision food recognition, medical diagnosis.

## 3. High-Level Design

```
 Browser (responsive web)
        │ HTTPS
        ▼
 Next.js (React + TypeScript)  ── UI, SSR, API routes / BFF
        │
        ▼
 Application Layer (Node.js / TypeScript)
   ├─ Auth & Session
   ├─ Profile Service
   ├─ Nutrition Engine (deterministic)
   ├─ Meal Plan Service ──► AI Provider (LLM) ──► Output Validator
   ├─ Tracking Service
   ├─ Subscription & Entitlement Service ──► Payment Provider (webhooks)
   └─ Admin Service
        │
        ▼
 PostgreSQL (Prisma ORM)        Redis (optional: rate limits/queue)
        │
 Logging / Error Monitoring / Backups
```

A modular monolith is chosen for speed and simplicity at MVP stage. Modules have clear boundaries so they can be split later.

## 4. Proposed Technology Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | Next.js, React, TypeScript | Responsive, mobile-first |
| Backend | Node.js (Next.js API routes or Express/Fastify) | Final choice per repo inspection |
| Database | PostgreSQL + Prisma | Migrations versioned |
| AI | LLM provider via server-side adapter | Provider abstracted behind an interface |
| Payments | Provider TBD (e.g. Razorpay/Stripe) | **CTO decision required** |
| Hosting | Docker on VPS or managed platform | **CTO decision required** |
| CI/CD | GitHub Actions | Build, type-check, test, deploy |

Existing repository conventions take precedence over these proposals.

## 5. Key Design Decisions

1. **Nutrition is deterministic.** BMI, BMR (Mifflin-St Jeor), TDEE and macro targets are computed in code with unit tests, never by free-form AI.
2. **AI generates structure, code validates it.** The LLM returns JSON against a strict schema; output is validated and cross-checked against the verified food database. Unverifiable values are flagged, not invented.
3. **Server-side entitlements.** Premium access derives from the subscription table, updated only by verified payment webhooks.
4. **User data isolation.** Every query is scoped by authenticated user id; enforced in a data-access layer and covered by tests.
5. **Safety boundary.** No diagnosis or treatment advice. Users outside safe ranges or reporting medical conditions get a professional-consultation message instead of a plan. Disclaimers shown in UI.
6. **Provider abstraction.** AI and payment providers sit behind adapters to allow replacement.

## 6. AI Meal Plan Flow

1. User requests plan → entitlement and rate-limit check.
2. Load profile + computed nutrition targets.
3. Build prompt from profile, preferences, allergies, exclusions, budget (no personal identifiers sent).
4. Call LLM with structured-output schema; timeout and retry with limits.
5. Validate schema; map foods to verified database; recompute calories/protein from database values.
6. Reject/regenerate on allergy or exclusion violations or large target deviation.
7. Persist plan; return to user. On failure, return a clear error, never partial fabricated data.

## 7. Non-Functional Requirements

- Availability target for MVP: best effort with monitoring; no formal SLA.
- Performance: API p95 < 500 ms excluding AI generation; AI generation async or with progress state (target < 30 s).
- Security and privacy: see `Security.md`.
- Observability: structured logs, error tracking, health endpoint.
- Accessibility and responsiveness: mobile-friendly layout, WCAG basics.

## 8. Extensibility Notes

- Plan/entitlement tables support new tiers without schema redesign.
- Food database is extensible for regional foods.
- Future: condition-specific diets (require clinical validation), wearables, native apps via the same `/api/v1`.
