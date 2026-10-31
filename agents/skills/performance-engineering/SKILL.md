# PERFORMANCE ENGINEERING

## PURPOSE

Identify and remove measurable performance bottlenecks without unnecessary complexity.

## AREAS

Frontend:

* Bundle size
* Rendering
* Network requests
* Images
* Caching
* Loading performance

Backend:

* API latency
* CPU
* Memory
* Concurrency
* External service latency

Database:

* Slow queries
* Indexes
* Query plans
* Connection pools

Infrastructure:

* CPU
* Memory
* Disk
* Network
* Container limits

## PROCESS

1. Establish baseline.
2. Measure.
3. Identify bottleneck.
4. Determine root cause.
5. Propose optimization.
6. Compare trade-offs.
7. Obtain authorization.
8. Implement.
9. Measure again.
10. Compare before/after.

## RULES

* Never optimize based only on assumptions.
* Prefer measurements over opinions.
* Do not sacrifice correctness for speed without approval.
* Record before/after results.
* Avoid premature optimization.

## OUTPUT

* Baseline
* Bottleneck
* Evidence
* Optimization
* Before/after metrics
* Trade-offs
* Recommendation
