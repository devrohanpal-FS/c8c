# Agent Status Contract

## Purpose

Every specialized agent MUST maintain a clear execution status during
every assigned task.

The status contract exists so the Human/CTO can always determine:

- which agent is working
- what task it is performing
- what phase it is in
- what files/modules it is touching
- whether tests are running
- whether the agent is blocked
- whether approval is required
- what the next action is

---

# Mandatory Agent Status

Every agent MUST report the following status block when:

1. A task starts
2. The task changes materially
3. The agent becomes blocked
4. Human/CTO approval is required
5. The task is completed

Use exactly this structure:

AGENT STATUS
------------

Agent: <agent-name>
Task ID: <unique-task-id>
Phase: <current-phase>
Status: <status>

Current Work:
- <current activity>

Files / Modules:
- <file or module>

Source of Truth:
- <document>
- <document>

Tests:
- <running / passed / failed / not-run>

Blockers:
- <none or blocker>

Approval Required:
- <YES / NO>

Next Action:
- <next action>

---

# Allowed Status Values

IN_PROGRESS
WAITING
BLOCKED
REVIEW_REQUIRED
COMPLETED
FAILED
IDLE

---

# Status Rules

## IN_PROGRESS

Use when the agent is actively performing work.

## WAITING

Use when the agent is waiting for another agent, dependency,
external process, or required input.

## BLOCKED

Use when progress cannot continue without resolving a blocker.

## REVIEW_REQUIRED

Use when work is complete but Human/CTO or another designated
reviewer must approve it before proceeding.

## COMPLETED

Use only when the assigned task and required verification are complete.

## FAILED

Use when the task could not be completed due to an error.

## IDLE

Use when no task is currently assigned.

---

# Critical Rules

1. Never claim IN_PROGRESS if no actual task is being executed.

2. Never claim COMPLETED without performing the required verification.

3. Never hide blockers.

4. Never silently change requirements.

5. Never silently change architecture.

6. Never silently change database schema.

7. Never silently change API contracts.

8. Never silently weaken security controls.

9. Any material deviation from approved documentation MUST be reported.

10. If Human/CTO approval is required, set:

Approval Required: YES

and

Status: REVIEW_REQUIRED

11. Status reporting MUST NOT replace actual implementation,
testing, security review, or verification.

12. The approved project documentation remains the Source of Truth.