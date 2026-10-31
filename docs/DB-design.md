# Database Design — AI Health & Diet Planner (MVP)

Status: **Proposed — requires CTO approval.** Database: PostgreSQL. ORM/migrations: Prisma.

## 1. Entities Overview

```
User 1──1 HealthProfile
User 1──* MealPlan 1──* PlanDay 1──* PlanMeal 1──* PlanMealItem *──1 Food
User 1──* MealLog *──? Food
User 1──* WeightLog
User 1──* Subscription *──1 Plan
Subscription 1──* Payment
PaymentEvent (webhook store, idempotency)
RefreshToken, AuditLog
```

## 2. Tables

### users
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| email | citext unique | lowercase |
| password_hash | text | argon2id/bcrypt |
| name | text | |
| role | enum(USER, ADMIN) | default USER |
| email_verified_at | timestamptz null | |
| created_at, updated_at | timestamptz | |

### refresh_tokens
id, user_id FK, token_hash, expires_at, revoked_at, created_at, user_agent, ip.

### health_profiles
| Column | Type | Notes |
|---|---|---|
| user_id | uuid PK/FK | one per user |
| date_of_birth | date | |
| sex | enum(MALE, FEMALE, OTHER) | |
| height_cm | numeric(5,1) | check 100–250 |
| weight_kg | numeric(5,1) | check 30–300 |
| activity_level | enum | sedentary…very_active |
| goal | enum(WEIGHT_LOSS, MUSCLE_GAIN, MAINTENANCE) | |
| diet_type | enum(VEG, NON_VEG, EGGETARIAN, VEGAN) | |
| allergies | text[] | |
| excluded_foods | text[] | |
| weekly_budget_inr | integer null | |
| medical_flag | boolean | user reports a condition → no plan, advisory only |
| updated_at | timestamptz | |

### foods
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| name | text | indexed (trigram search) |
| category | text | |
| diet_type | enum | veg/non-veg tagging |
| serving_unit | text | e.g. 100 g, 1 roti |
| serving_grams | numeric | |
| calories, protein_g, carbs_g, fat_g, fiber_g | numeric | per serving |
| approx_cost_inr | numeric null | |
| source | text | data source reference |
| verified | boolean | only verified used in plans |

### meal_plans
id, user_id FK, title, start_date, target_calories, target_protein_g, target_carbs_g, target_fat_g, status (GENERATING, READY, FAILED), ai_model, generation_meta jsonb, created_at.

### plan_days
id, meal_plan_id FK, day_index (1–7), total_calories, total_protein_g.

### plan_meals
id, plan_day_id FK, meal_type (BREAKFAST, LUNCH, DINNER, SNACK), order_index.

### plan_meal_items
id, plan_meal_id FK, food_id FK, quantity, calories, protein_g, nutrition_verified boolean.

### meal_logs
id, user_id FK, logged_at, meal_type, food_id FK null, custom_name null, quantity, calories, protein_g, plan_meal_item_id FK null.

### weight_logs
id, user_id FK, weight_kg, logged_on (date), unique(user_id, logged_on).

### plans (subscription tiers)
id, code (FREE, PREMIUM_MONTHLY, PREMIUM_YEARLY), name, price_inr, interval, features jsonb (e.g. monthly plan generations, alternatives, grocery list), active.

### subscriptions
id, user_id FK, plan_id FK, status (ACTIVE, PAST_DUE, CANCELED, EXPIRED), current_period_start, current_period_end, cancel_at_period_end, provider_subscription_id, created_at, updated_at.

### payments
id, user_id FK, subscription_id FK, provider, provider_payment_id unique, amount, currency, status, paid_at, created_at.

### payment_events
id, provider, event_id unique (idempotency), type, payload jsonb, processed_at, status.

### audit_logs
id, actor_user_id, action, entity, entity_id, metadata jsonb, ip, created_at.

## 3. Indexes & Constraints

- `users(email)` unique; `meal_plans(user_id, created_at desc)`; `meal_logs(user_id, logged_at)`; `weight_logs(user_id, logged_on)` unique.
- `foods` trigram index on name; partial index on `verified = true`.
- `payment_events(event_id)` unique; `payments(provider_payment_id)` unique.
- Foreign keys with `ON DELETE CASCADE` for user-owned data (supports account deletion).
- Check constraints for physical ranges and positive quantities.

## 4. Data Rules

- All user-owned queries include `user_id` filter (data-access layer enforced).
- Health data is sensitive personal data: minimize fields, encrypt at rest (disk/DB level), no health data in logs.
- Soft deletion not used for health data; account deletion must remove user-owned rows (retain payment records as legally required).
- Money stored in integer minor units or numeric; currency explicit.

## 5. Migrations & Seeding

- Prisma migrations versioned in repo; applied via CI/CD; rehearsed on staging copy before production.
- Seed: plans (FREE, PREMIUM), initial verified Indian food dataset (source documented).
- Backups: daily automated backup with tested restore (see `Deployment.md`).
