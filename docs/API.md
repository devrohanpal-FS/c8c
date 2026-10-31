# API Specification — AI Health & Diet Planner (MVP)

Status: **Proposed — requires CTO approval before implementation.**
Base URL: `/api/v1` | Format: JSON | Auth: Bearer access token (JWT) via httpOnly cookie or `Authorization` header.

## 1. Conventions

- All request bodies are validated server-side (schema validation, e.g. Zod). Unknown fields are rejected.
- Every user-owned resource is scoped by the authenticated `userId`; the client never supplies `userId`.
- Premium features are enforced **server-side** from the subscription record, never from client flags.
- Standard error shape:

```json
{ "error": { "code": "VALIDATION_ERROR", "message": "Human readable", "details": [] } }
```

| HTTP | Code | Meaning |
|---|---|---|
| 400 | VALIDATION_ERROR | Invalid input |
| 401 | UNAUTHENTICATED | Missing/invalid token |
| 403 | FORBIDDEN / PREMIUM_REQUIRED | Not allowed / plan too low |
| 404 | NOT_FOUND | Resource missing or not owned by user |
| 409 | CONFLICT | Duplicate (e.g. email) |
| 429 | RATE_LIMITED | Too many requests |
| 500 | INTERNAL_ERROR | Unexpected failure (no internal details leaked) |

- Pagination: `?page=1&limit=20` (max 100). Dates: ISO 8601 (UTC).

## 2. Auth

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/auth/register` | Create account (email, password, name) | No |
| POST | `/auth/login` | Returns access + refresh tokens | No |
| POST | `/auth/refresh` | Rotate refresh token | Refresh |
| POST | `/auth/logout` | Revoke refresh token | Yes |
| POST | `/auth/forgot-password` | Send reset link | No |
| POST | `/auth/reset-password` | Reset using token | No |

## 3. Health Profile

| Method | Endpoint | Description |
|---|---|---|
| GET | `/profile` | Get own health profile |
| PUT | `/profile` | Create/update profile |

Profile fields: `dateOfBirth`, `sex`, `heightCm`, `weightKg`, `activityLevel` (sedentary, light, moderate, active, very_active), `goal` (weight_loss, muscle_gain, maintenance), `dietType` (vegetarian, non_vegetarian, eggetarian, vegan), `allergies[]`, `excludedFoods[]`, `weeklyBudgetInr`.

Validation: age 18–80 for MVP; height 100–250 cm; weight 30–300 kg. Users outside range or flagging a medical condition receive a "consult a professional" response instead of a plan.

## 4. Nutrition

| Method | Endpoint | Description |
|---|---|---|
| GET | `/nutrition/summary` | BMI, BMR, TDEE, calorie target, macro targets (computed deterministically, not by AI) |

Response example:

```json
{ "bmi": 24.2, "bmiCategory": "normal", "bmr": 1680, "tdee": 2600,
  "targetCalories": 2100, "proteinG": 130, "carbsG": 230, "fatG": 60,
  "assumptions": ["Mifflin-St Jeor", "Activity multiplier 1.55"] }
```

## 5. Meal Plans

| Method | Endpoint | Description | Plan |
|---|---|---|---|
| POST | `/meal-plans/generate` | Generate 7-day plan from profile | Free: limited/month, Premium: higher |
| GET | `/meal-plans` | List own plans | Free |
| GET | `/meal-plans/:id` | Plan detail (days → meals → items) | Free |
| POST | `/meal-plans/:id/meals/:mealId/alternatives` | Suggest food alternatives | Premium |
| GET | `/meal-plans/:id/grocery-list` | Aggregated grocery list | Premium |
| DELETE | `/meal-plans/:id` | Delete plan | Free |

Generation is validated against the verified food database. Items without verified nutrition data are flagged `nutritionVerified: false` and shown without numeric precision.

## 6. Tracking

| Method | Endpoint | Description |
|---|---|---|
| POST | `/meal-logs` | Log a meal (planned item or custom food) |
| GET | `/meal-logs?date=YYYY-MM-DD` | Logs and daily totals (calories, protein) |
| DELETE | `/meal-logs/:id` | Remove log |
| POST | `/weight-logs` | Add weight entry |
| GET | `/weight-logs?from=&to=` | Weight history |

## 7. Foods

| Method | Endpoint | Description |
|---|---|---|
| GET | `/foods?q=` | Search verified food database |
| GET | `/foods/:id` | Food nutrition detail |

## 8. Subscriptions & Payments

| Method | Endpoint | Description |
|---|---|---|
| GET | `/plans` | Free/Premium plan details and pricing |
| GET | `/subscription` | Current subscription status |
| POST | `/subscription/checkout` | Create payment order/session |
| POST | `/subscription/cancel` | Cancel at period end |
| POST | `/webhooks/payment` | Payment provider webhook (signature verified, idempotent) |

Rules: premium is granted only after server-side verification of the provider webhook/signature; webhook events are stored and processed idempotently.

## 9. Admin (Basic)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/users` | List users (role: ADMIN only) |
| GET | `/admin/subscriptions` | Subscription overview |
| GET | `/admin/stats` | Basic usage metrics |
| PATCH | `/admin/foods/:id` | Maintain food database |

## 10. Rate Limits (initial)

- Auth endpoints: 10 req/min/IP.
- `/meal-plans/generate`: 5 req/hour/user.
- General API: 100 req/min/user.
