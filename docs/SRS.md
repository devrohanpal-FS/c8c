# Software Requirements Specification (SRS)
## AI Health & Diet Planning Platform — MVP

**Version:** 1.0  
**Date:** 13 October 2026  
**Status:** Draft for review

---

## 1. Introduction

### 1.1 Purpose

This SRS specifies functional, interface, data, security, performance, and acceptance requirements for the MVP of the AI Health & Diet Planning Platform. It is a baseline for implementation and QA and must be reviewed before development.

### 1.2 Scope

The software is a responsive web application that collects an adult user's profile and food preferences, generates a general-wellness meal plan, validates the output, displays meals and approximate nutrition information, and supports meal substitutions, shopping lists, and basic progress logging.

### 1.3 Definitions

- **MVP:** Minimum viable product.
- **Plan:** A dated multi-day set of meals with portions and preparation notes.
- **Safety gate:** Rules that prevent unsupported or higher-risk scenarios from receiving automated diet recommendations.
- **Nutrition estimate:** Approximate energy/macronutrient values calculated from a defined food data source.
- **PII:** Personally identifiable information.

## 2. Overall Description

### 2.1 Product Perspective

The system consists of a browser-based frontend, backend API, relational data store, AI generation service, nutrition/food data module, authentication service, and operational logging/monitoring. AI output is untrusted until schema validation and safety checks succeed.

### 2.2 User Classes

- **Guest:** can view public product information and create an account.
- **Registered user:** manages profile, generates and views plans, swaps meals, uses shopping lists, and records optional progress.
- **Administrator:** manages approved food/configuration data and reviews flagged errors; should use least-privilege access.
- **Operations/support role:** accesses service health and technical logs without unnecessary access to sensitive profile content.

### 2.3 Operating Environment

- Modern desktop and mobile browsers; responsive layouts.
- HTTPS-only production access.
- Server-side environment variables or managed secrets for API keys.
- Staging and production environments must be logically separated.

### 2.4 Constraints

- MVP recommendations are for general wellness for adults, not diagnosis or treatment.
- Medical report parsing and disease-specific plans are excluded.
- Nutrition figures must be labeled estimates and tied to a documented source or calculation method.
- AI responses must be constrained to a validated schema; free-form text alone must not be treated as trusted structured data.
- Production deployment and destructive data/schema changes require explicit approval.

## 3. Functional Requirements

| ID | Requirement | Specification |
|---|---|---|
| FR-001 | Account registration | The system shall allow a user to register with a supported authentication method and shall validate required fields. |
| FR-002 | Authentication | The system shall allow registered users to sign in and sign out securely. |
| FR-003 | Password recovery | If password-based authentication is enabled, the system shall provide a secure password-reset flow. |
| FR-004 | Profile creation | The system shall collect age/date-of-birth approach, height, weight, activity level, goal, dietary pattern, allergies/intolerances, excluded foods, budget range, meals per day, cooking time, and timezone/locale where needed. |
| FR-005 | Profile editing | The system shall let a user review and update their profile and preferences. |
| FR-006 | Input validation | The system shall reject missing, malformed, implausible, or unsupported values with actionable validation messages. |
| FR-007 | Eligibility screening | Before plan generation, the system shall screen for configured out-of-scope conditions and risk cases. |
| FR-008 | Safety response | If a request is out of scope, the system shall not generate a personalized therapeutic plan and shall display approved guidance to consult an appropriate qualified professional. |
| FR-009 | Plan request | An eligible user shall be able to request a plan for an allowed goal and configured duration. |
| FR-010 | Plan generation | The backend shall request a structured plan from the generation service using the user's validated profile and approved constraints. |
| FR-011 | Output validation | The backend shall validate schema, required fields, date range, meal count, food exclusions, and configured safety constraints before saving or displaying a plan. |
| FR-012 | Generation failure | On timeout, malformed output, or provider failure, the system shall show a recoverable error and shall not display an unvalidated plan as successful. |
| FR-013 | Plan display | The system shall display days, meals, portion guidance, preparation notes, and available estimated nutrition information. |
| FR-014 | Meal substitution | The user shall be able to request a replacement for a meal; replacement must preserve declared exclusions and dietary pattern. |
| FR-015 | Shopping list | The system shall aggregate ingredients from a plan and allow users to mark items complete. |
| FR-016 | Progress log | The system shall allow optional logging of date, user-entered weight, adherence, and subjective feedback. |
| FR-017 | Plan history | The system shall list a user's previously saved plans, subject to retention policy. |
| FR-018 | Data export/delete | The system shall provide a documented process for account deletion and applicable user-data deletion; export may be P1/P2 if not delivered in the first MVP. |
| FR-019 | Admin configuration | Authorized admins shall be able to update approved food/configuration data and safety copy through a protected mechanism. |
| FR-020 | Auditability | The system shall record generation status, model/provider version where available, rules version, and non-sensitive error metadata for debugging. |
| FR-021 | Authorization | The system shall ensure users can access only their own profile, plans, shopping lists, and progress records. |
| FR-022 | Disclaimer acknowledgement | The system shall show and record acceptance of the relevant Terms, Privacy Policy, and health disclaimer before first personalized plan generation. |

## 4. External Interface Requirements

### 4.1 User Interface

- **Landing page:** product purpose, supported goals, limitations, privacy and safety information.
- **Authentication pages:** registration, sign-in, and recovery where applicable.
- **Onboarding wizard:** grouped questions, progress indicator, back/edit navigation, validation messages.
- **Dashboard:** current plan, plan generation action, recent progress, and prior plans.
- **Plan view:** date/day navigation, meal cards, portion details, estimated nutrition labels, swap action, and shopping-list entry point.
- **Shopping list:** grouped ingredients, quantity where calculable, checkboxes, and clear estimate caveat.
- **Profile/settings:** editable preferences, data controls, and account deletion instructions.
- **Admin interface or secure configuration workflow:** role-protected and unavailable to normal users.

### 4.2 API Interfaces

Proposed REST endpoints; names are illustrative and should be confirmed during architecture design.

| Method / endpoint | Purpose | Access |
|---|---|---|
| `POST /api/profile` | Create or update profile | Authenticated user |
| `GET /api/profile` | Read own profile | Authenticated user |
| `POST /api/plans` | Request plan generation | Authenticated, eligible user |
| `GET /api/plans` | List own plans | Authenticated user |
| `GET /api/plans/{planId}` | Read one plan | Owner only |
| `POST /api/plans/{planId}/meals/{mealId}/swap` | Replace meal | Owner only |
| `GET /api/plans/{planId}/shopping-list` | Get aggregated ingredients | Owner only |
| `POST /api/progress` | Create progress log | Authenticated user |
| `DELETE /api/account` | Initiate account deletion | Authenticated user with re-authentication |

### 4.3 Third-Party Interfaces

- Authentication provider or secure first-party authentication implementation.
- LLM/AI provider for structured plan generation.
- Nutrition/food data provider or curated database.
- Email provider for verification/reset notifications if applicable.
- Error monitoring and application logging provider.

## 5. Data Requirements

| Entity | Core fields (proposed) | Notes |
|---|---|---|
| User | `id`, `auth_subject`, `email`, `created_at`, `status` | Auth secrets should be managed by the auth provider where possible. |
| UserProfile | `user_id`, age representation, height, weight, activity, goal, diet pattern, allergies, exclusions, budget, meal count, cooking time | Collect only required data; review sensitive-data handling. |
| MealPlan | `id`, `user_id`, `created_at`, `start_date`, `duration`, `goal`, `status`, `generation_version`, `rules_version` | Status may include queued, generating, validated, failed, blocked. |
| PlanDay | `id`, `plan_id`, `date`, `day_index` | One row per plan day. |
| Meal | `id`, `plan_day_id`, `meal_type`, `title`, `ingredients`, `portions`, `instructions`, `estimated_nutrition` | Nutrition fields nullable if no reliable source. |
| ShoppingListItem | `id`, `plan_id`, `ingredient`, `quantity`, `unit`, `checked` | Quantities may be approximate or unavailable. |
| ProgressLog | `id`, `user_id`, `date`, optional weight, adherence, feedback, notes | Optional feature; users can choose not to log weight. |
| GenerationAudit | `id`, `user_id`, `plan_id`, provider, model version, rules version, status, error code, created_at | Avoid storing unnecessary prompts or sensitive raw profile data in logs. |

## 6. Non-Functional Requirements

| ID | Requirement |
|---|---|
| NFR-001 Performance | For ordinary pages, target p95 response time ≤ 2 seconds under agreed pilot load, excluding AI generation. |
| NFR-002 Generation latency | Target plan generation display within 120 seconds; show progress state and permit safe retry on timeout. |
| NFR-003 Availability | Pilot availability target ≥ 99% monthly, excluding announced maintenance; confirm hosting/SLA. |
| NFR-004 Security | Use HTTPS, secure sessions, least-privilege access, server-side authorization, input validation, rate limiting, and secrets management. |
| NFR-005 Privacy | Publish a privacy notice, minimize collected data, define retention/deletion, and avoid sensitive data in analytics/logs. |
| NFR-006 Isolation | All user-owned resources must enforce ownership checks server-side; UI hiding alone is insufficient. |
| NFR-007 Reliability | Generation output must pass schema and constraint validation before use; failures must be observable and recoverable. |
| NFR-008 Accessibility | Target WCAG 2.2 AA where practical, including keyboard navigation, labels, contrast, and error announcements. |
| NFR-009 Compatibility | Support current stable versions of major desktop and mobile browsers at release. |
| NFR-010 Maintainability | Use documented modules, typed contracts where supported, migrations, automated tests, and environment-specific configuration. |
| NFR-011 Observability | Capture request correlation IDs, latency, error rates, generation outcomes, and safety-block counts without logging unnecessary health details. |
| NFR-012 Scalability | AI generation should use request limits and asynchronous processing if needed; do not introduce Kubernetes unless scale justifies it. |
| NFR-013 Backup/recovery | Define backup frequency, retention, restore procedure, and verify restoration before public launch. |
| NFR-014 Legal/safety | Obtain appropriate review of disclaimers, privacy/terms, food/allergen wording, and launch-market obligations before public release. |

## 7. AI Generation and Safety Requirements

- Treat AI output as untrusted input. Require a strict JSON/schema response and validate it server-side.
- Apply hard filters for allergies, excluded foods, diet pattern, supported goals, and configured safety constraints.
- Do not make diagnoses, prescribe treatment, recommend stopping medication, or interpret lab reports in MVP.
- Do not generate therapeutic plans for configured high-risk/out-of-scope cases; show reviewed safety copy.
- Do not claim a meal is allergen-free unless the food data and preparation context support that claim; remind users to check labels and cross-contamination where relevant.
- Label calories, macros, and food costs as estimates; omit figures when source data is insufficient.
- Persist prompt/rules version identifiers and outcome metadata for reproducibility, while minimizing retained sensitive text.
- Test allergen exclusions, vegetarian constraints, malformed model output, prompt injection in free-text fields, provider outage, and unsupported medical requests.

## 8. Error Handling

| Scenario | Expected behaviour |
|---|---|
| Invalid profile input | Inline field errors; do not submit until required fields are valid. |
| Safety gate blocks request | Explain that the feature is not designed for that situation; do not call plan generation. |
| AI timeout/provider outage | Show retryable message; record safe error metadata; avoid duplicate plans on retry. |
| Malformed/unsafe output | Reject output, retry only under controlled policy or return an error; never render as a valid plan. |
| Network loss | Preserve non-sensitive unsent form state where safe and allow retry. |
| Unauthorized resource access | Return generic 403/404 behaviour without disclosing another user's data. |
| Rate limit exceeded | Return a clear retry-later message and enforce server-side limits. |

## 9. Security and Privacy Controls

- Use role-based access control for admin functions and enforce authorization in every backend handler.
- Protect against common web vulnerabilities, including injection, XSS, CSRF where applicable, insecure direct object references, and abuse of generation endpoints.
- Keep API keys and secrets out of source control and client bundles.
- Encrypt traffic in transit; use platform/database encryption at rest where available.
- Apply rate limits and abuse controls to authentication and AI generation.
- Set a retention policy for profiles, plans, progress, and audit data; support deletion workflow.
- Conduct dependency scanning, secret scanning, and security checks before release.

## 10. Verification and Acceptance Criteria

- A new user can register, complete onboarding, accept the disclaimer, and reach the dashboard.
- Invalid required fields are rejected with understandable messages.
- A supported adult user can generate and view a 7-day plan with the required structure.
- Declared allergies, exclusions, and dietary pattern are enforced by server-side validation; automated tests cover representative cases.
- An out-of-scope request is blocked before generation and displays approved safety copy.
- Malformed or unsafe AI output is never presented as a successful plan.
- A user can swap a meal and see the updated plan and shopping list.
- A user cannot read or alter another user's profile, plan, shopping list, or progress record.
- Generation failure, timeout, and rate-limit states are tested.
- Account deletion, backup/restore, and production rollback procedures are documented and reviewed before public launch.

## 11. Suggested Test Plan

| Test level | Coverage |
|---|---|
| Unit | Validation rules, nutrition calculations, safety gate, schema validation, shopping-list aggregation. |
| Integration | Auth, database access, AI provider adapter, nutrition source adapter, rate limiting. |
| API | Success/error responses, authorization, ownership checks, idempotency and retry behaviour. |
| E2E | Registration → onboarding → generation → plan view → swap → shopping list → progress log. |
| Security | IDOR/ownership, input injection, session handling, secrets, rate limits, dependency scanning. |
| AI/safety evaluation | Allergen exclusion, diet preferences, unsupported medical prompts, malformed output, consistency and refusal behaviour. |
| Operational | Monitoring alerts, backup restore, staging deployment, health check, rollback rehearsal. |

## 12. Proposed MVP Architecture (Technology-Neutral)

- **Frontend:** responsive web application with typed form validation and accessible components.
- **Backend:** authenticated API with profile, plan, shopping-list, progress, and admin modules.
- **Database:** relational database with migrations and user ownership constraints.
- **AI adapter:** isolated module for prompt construction, provider calls, timeouts, schema validation, and retries.
- **Nutrition module:** curated/provider food data and deterministic calculations where available.
- **Operations:** structured logs, error monitoring, metrics, backups, staging/production separation.

A specific stack (for example, Next.js + TypeScript + PostgreSQL/Prisma) should be selected in a separate architecture decision record after repository and team constraints are reviewed.

## 13. Deployment and Release Gate

1. Build and automated tests pass.
2. Security/dependency scan and secrets scan reviewed.
3. Database migrations reviewed and backup/restore procedure confirmed.
4. Staging smoke tests and end-to-end critical path pass.
5. AI safety evaluation set passes agreed acceptance thresholds.
6. Monitoring, alerts, health checks, and rollback plan are ready.
7. Production deployment receives explicit approval.
8. Post-deployment health and critical user flows are verified.

## 14. Assumptions, Risks, and Open Questions

- Confirm launch geography, language, and legal/privacy requirements.
- Confirm exact safety-screening cases with a qualified nutrition/clinical reviewer.
- Select the nutrition data source and define handling of missing data.
- Decide whether age is stored as age band, birth year, or date of birth; prefer data minimization.
- Define whether plan generation is synchronous or queued based on provider latency.
- Confirm user-data retention, deletion, backups, and support access policies.
- Cost and reliability depend on AI provider, nutrition data, hosting, and usage; estimates require provider/architecture choices.

## 15. Traceability: PRD to SRS

| PRD feature | Related SRS requirements |
|---|---|
| Authentication and account | FR-001 to FR-003, FR-021 |
| Onboarding/profile | FR-004 to FR-006 |
| Safety gate | FR-007, FR-008, FR-022; Section 7 |
| Plan generation and display | FR-009 to FR-013 |
| Meal swap | FR-014 |
| Shopping list | FR-015 |
| Progress/history | FR-016, FR-017 |
| Privacy/data controls | FR-018, NFR-005, Section 9 |
| Admin/operations | FR-019, FR-020; NFR-011 to NFR-013 |

## 16. Approval

| Role | Name | Decision / date |
|---|---|---|
| Product owner | To be assigned | Pending |
| Engineering lead / CTO | To be assigned | Pending |
| Nutrition / safety reviewer | Qualified reviewer to be assigned | Pending |
| QA / release owner | To be assigned | Pending |
