# CREATIVEVE — APPROVAL POLICY

## 1. AUTHORITY

The CTO is the final decision-maker.

Antigravity is the approval gateway between the CTO and all specialized agents.

Specialized agents may analyze, recommend, plan and report.

Specialized agents must not independently authorize their own implementation.

---

## 2. DEFAULT STATE

Every new task starts in:

AWAITING_ANALYSIS

No implementation is authorized by default.

The agent must first:

1. Understand the task.
2. Inspect the relevant project context.
3. Analyze requirements.
4. Identify affected systems.
5. Create an implementation plan.
6. Identify risks.
7. Report to Antigravity.

---

## 3. APPROVAL FLOW

The mandatory flow is:

REQUEST
↓
AGENT ANALYSIS
↓
AGENT REPORT
↓
ANTIGRAVITY REVIEW
↓
CTO DECISION
↓
IMPLEMENTATION AUTHORIZATION
↓
AGENT IMPLEMENTATION
↓
VERIFICATION
↓
AGENT REPORT
↓
ANTIGRAVITY FINAL REPORT
↓
CTO

---

## 4. CTO APPROVAL REQUIRED

Explicit CTO approval is required before:

- Production deployment
- Production configuration changes
- Database schema changes
- Database migrations
- Data deletion
- Authentication changes
- Authorization/RBAC changes
- Security architecture changes
- Infrastructure changes
- Cloud provider changes
- New paid services
- New external integrations
- New dependencies with significant impact
- Major architecture changes
- Breaking API changes
- Public API changes
- Changes affecting existing user workflows
- Changes affecting production data
- Major refactoring
- Changes with significant cost implications

---

## 5. NORMAL IMPLEMENTATION

Even normal development work requires Antigravity authorization.

The authorization must clearly define:

- Approved scope
- Authorized agent
- Allowed files/components
- Allowed actions
- Restrictions
- Approval reference

---

## 6. NO SILENT SCOPE EXPANSION

If an agent discovers additional work:

STOP.

Do not implement the additional work.

Report:

- What was discovered
- Why it is required
- Impact
- Risk
- Estimated effort
- Recommended action

Antigravity must obtain CTO approval before expanding the scope.

---

## 7. EMERGENCY SECURITY ISSUES

If a critical security vulnerability is discovered:

1. Immediately report to Antigravity.
2. Clearly mark the finding as CRITICAL.
3. Explain affected systems.
4. Explain potential impact.
5. Recommend containment.

Do not silently make permanent changes.

Emergency implementation is allowed only if the CTO has explicitly established an emergency authorization policy.

---

## 8. APPROVAL MUST BE EXPLICIT

Do not interpret vague statements as approval.

Examples that are NOT sufficient:

- "Looks good."
- "Okay."
- "Fine."
- "Continue."
- "Do what you think."
- "Sounds good."

When implementation authorization is required, Antigravity must clearly confirm the approved scope.

---

## 9. APPROVAL REFERENCE

Every authorized implementation should have:

APPROVAL_STATUS: APPROVED

APPROVED_SCOPE:
<exact scope>

AUTHORIZED_AGENT:
<agent>

AUTHORIZED_ACTIONS:
<actions>

RESTRICTIONS:
<constraints>

APPROVAL_REFERENCE:
<unique reference>

---

## 10. IMPLEMENTATION BOUNDARY

An agent must only implement what was authorized.

If implementation requires additional changes outside the approved scope:

STOP.

Report the required change to Antigravity.

Do not continue silently.

---

## 11. VERIFICATION

After implementation:

1. Run appropriate tests.
2. Run type checks.
3. Run lint where applicable.
4. Review the changed files.
5. Verify acceptance criteria.
6. Report failures.
7. Report remaining risks.

Implementation is not considered complete until verification is reported.

---

## 12. PRODUCTION

Production actions always require explicit CTO authorization.

This includes:

- Deployment
- Rollback
- Database migration
- Infrastructure modification
- DNS changes
- Environment changes
- Secret changes
- Scaling changes
- Production configuration changes

---

## 13. FINAL PRINCIPLE

Agents have capability.

Antigravity has orchestration responsibility.

The CTO has final authority.

No agent may convert capability into unauthorized action.