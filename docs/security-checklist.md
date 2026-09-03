Kipepeo Market — Security Checklist
## Chapter 11 — Security & Application Hardening
---
## Secrets
- [ ] Session secret is stored in environment configuration
- [ ] .env is included in .gitignore
- [ ] No hardcoded session secret exists
- [ ] No hardcoded admin password exists
- [ ] Secrets are not logged
---
## Authentication
- [ ] Passwords use bcrypt
- [ ] Password hashes are not returned by APIs
- [ ] Login validates input
- [ ] Registration validates input
- [ ] Duplicate emails are rejected
- [ ] Session is regenerated after login
- [ ] Logout destroys the session
---
## Sessions
- [ ] httpOnly cookie enabled
- [ ] secure cookie enabled in production
- [ ] sameSite configured
- [ ] Session secret comes from environment
- [ ] Session fixation protection implemented
---
## Authorization
- [ ] Customer role is default
- [ ] Client cannot assign admin role
- [ ] Admin middleware protects admin APIs
- [ ] Current admin role is verified
- [ ] Logged-out users receive 401
- [ ] Customers receive 403
- [ ] Admins receive 200
---
## Input Validation
- [ ] Name validated
- [ ] Email validated
- [ ] Password validated
- [ ] Input normalized
- [ ] Server validates input
- [ ] Client input is never trusted
---
## SQL Injection
- [ ] Parameterized queries used
- [ ] User input is not concatenated into SQL
- [ ] SQL injection login test rejected
---
## XSS
- [ ] User-generated text uses textContent where appropriate
- [ ] Untrusted HTML is not rendered directly
- [ ] XSS test performed
---
## CSRF
- [ ] CSRF token generated
- [ ] CSRF token stored in session
- [ ] State-changing requests require CSRF token
- [ ] Missing token rejected
- [ ] Invalid token rejected
---
## Security Headers
- [ ] Helmet installed
- [ ] Helmet middleware enabled
- [ ] Response headers inspected
---
## Rate Limiting
- [ ] General rate limiter enabled
- [ ] Authentication rate limiter enabled
- [ ] Repeated login attempts eventually receive 429
---
## Error Handling
- [ ] Internal errors are logged server-side
- [ ] Generic errors returned to clients
- [ ] Stack traces are not exposed
- [ ] Database details are not exposed
- [ ] File paths are not exposed
---
## Testing
- [ ] Authentication tested
- [ ] Authorization tested
- [ ] SQL injection tested
- [ ] XSS tested
- [ ] CSRF tested
- [ ] Rate limiting tested
- [ ] Session security tested
- [ ] Security regression testing completed
---
## Chapter 11 Status
Security review:
Date: _______________
Tester: _______________
Result:
- [ ] PASS
- [ ] PASS WITH MINOR ISSUES
- [ ] FAILED — FIX REQUIRED