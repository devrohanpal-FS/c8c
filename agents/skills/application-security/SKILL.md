# APPLICATION SECURITY

## PURPOSE

Reduce application security risk through secure design, code review, testing, remediation and verification.

## SECURITY AREAS

* Authentication
* Authorization
* Session security
* Input validation
* Output encoding
* XSS
* CSRF
* SQL injection
* Command injection
* SSRF
* IDOR/BOLA
* Path traversal
* File upload security
* Rate limiting
* CORS
* CSP
* Security headers
* Secrets management
* Dependency security
* Logging
* Error handling
* Container security
* CI/CD security

## PROCESS

1. Identify attack surface.
2. Identify trust boundaries.
3. Review architecture.
4. Review code.
5. Review configuration.
6. Review dependencies.
7. Identify vulnerabilities.
8. Determine root cause and impact.
9. Recommend remediation.
10. Obtain authorization.
11. Implement remediation.
12. Retest.
13. Check regression.
14. Report.

## RULES

* Never claim absolute security.
* Findings must be evidence-based.
* Clearly distinguish confirmed vulnerabilities from hypotheses.
* Prioritize by realistic risk.
* Never expose secrets.
* Never perform unauthorized destructive security testing.
* Remediation must be verified.

## OUTPUT

* Finding
* Severity
* Evidence
* Root cause
* Impact
* Remediation
* Retest
* Residual risk
