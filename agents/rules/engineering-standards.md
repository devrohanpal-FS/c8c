# CREATIVEVE — ENGINEERING STANDARDS

## 1. GENERAL PRINCIPLES

All engineering work must prioritize:

1. Correctness
2. Security
3. Maintainability
4. Testability
5. Performance
6. Simplicity
7. Observability

Do not introduce complexity without justification.

---

## 2. EXISTING CODEBASE

Before changing code:

- Inspect the existing architecture.
- Understand existing patterns.
- Identify reusable components.
- Identify existing utilities.
- Identify existing APIs.
- Identify existing database patterns.

Do not rewrite working systems unnecessarily.

---

## 3. SCOPE

Modify only files required for the approved task.

Do not:

- Refactor unrelated code.
- Rename unrelated files.
- Change unrelated UI.
- Upgrade dependencies unnecessarily.
- Change architecture unnecessarily.

---

## 4. CODE QUALITY

Code must:

- Be readable.
- Follow existing project conventions.
- Use meaningful names.
- Avoid unnecessary duplication.
- Avoid unnecessary abstraction.
- Handle errors explicitly.
- Validate external input.
- Keep responsibilities separated.

---

## 5. TYPESCRIPT / JAVASCRIPT

Prefer:

- Strict typing.
- Explicit interfaces/types where useful.
- Small functions.
- Clear async error handling.
- Consistent module boundaries.

Avoid:

- `any` without justification.
- Silent error swallowing.
- Unnecessary global state.
- Dead code.
- Unused dependencies.

---

## 6. API ENGINEERING

All APIs must:

- Validate input.
- Authenticate where required.
- Authorize server-side.
- Return consistent errors.
- Avoid exposing sensitive information.
- Handle failure states.
- Preserve existing contracts unless approved.

---

## 7. DATABASE

Database changes must consider:

- Data integrity
- Constraints
- Indexes
- Transactions
- Query performance
- Migration safety
- Rollback/recovery

Never perform destructive changes without approval.

---

## 8. SECURITY

Security must be considered during:

- Architecture
- Development
- Testing
- Deployment

Never:

- Hardcode secrets.
- Commit credentials.
- Disable security controls to make a feature work.
- Trust client-side authorization.
- Ignore known critical vulnerabilities.

---

## 9. TESTING

Relevant changes should include appropriate:

- Unit tests
- Integration tests
- API tests
- E2E tests

Test:

- Happy paths
- Negative paths
- Boundary conditions
- Error handling
- Authorization
- Regression scenarios

---

## 10. PERFORMANCE

Do not optimize blindly.

Performance changes should be based on:

- Measurement
- Logs
- Profiling
- Query analysis
- Runtime metrics

Record meaningful before/after results where possible.

---

## 11. DEPENDENCIES

Before adding a dependency:

- Verify whether existing functionality can be reused.
- Evaluate maintenance.
- Evaluate security.
- Evaluate bundle/runtime impact.
- Explain why it is needed.

Significant dependency changes require approval.

---

## 12. GIT

Use clear commits.

Prefer:

feat:
fix:
refactor:
test:
security:
perf:
docs:
chore:

Do not mix unrelated changes in one commit.

---

## 13. VERIFICATION

Before reporting completion:

- Typecheck
- Lint
- Tests
- Build
- Relevant functional verification

must be completed where applicable.

Never claim tests passed without actually running them.

---

## 14. DOCUMENTATION

If implementation changes:

- Requirements
- Architecture
- API behavior
- Database schema
- Deployment
- Security behavior

the relevant documentation must be updated.

---

## 15. FINAL ENGINEERING RULE

DO NOT optimize for:

"code generated quickly."

Optimize for:

"correct, secure, maintainable, tested and verifiable software."