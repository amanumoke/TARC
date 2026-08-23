# TARCMS Security & Privacy Design

> **Standard**: OWASP Top 10 Compliance & Institutional Data Governance

---

## 1. Authentication & Credential Security

- **Password Hashing**: Passwords hashed using `bcryptjs` with salt round cost factor of 10. Passwords are never logged, transmitted in responses, or stored in plaintext.
- **JWT Protection**:
  - Signed with cryptographic HMAC-SHA256 secret (`JWT_SECRET`).
  - Strict expiration window (24 hours for access tokens).
  - Payload contains minimal non-sensitive identity claims: `{ id, email, role }`.
- **Brute-Force Defense**: Rate limiting on `/api/v1/auth/login` allowing maximum 5 failed attempts per 15 minutes per IP address.

---

## 2. Authorization & Role-Based Access Control (RBAC)

- **Express Middleware Guards**:
  - `authenticateToken`: Validates Bearer token and verifies user is active in DB.
  - `requireRole(...roles)`: Verifies user has sufficient privilege tier (`SUPER_ADMIN`, `ADMIN`, `RESEARCHER`, `STAFF`).
- **Client Route Guards**:
  - `RequireAuth`: Redirects unauthenticated users to `/auth/login`.
  - `RequireRole`: Displays forbidden warning if authenticated user lacks role privileges.

---

## 3. Input Validation & Injection Defense

- **Zod Schema Validation**: All incoming request bodies and query parameters are strictly validated using shared Zod schemas before reaching service controllers.
- **SQL Injection Prevention**: Powered by Drizzle ORM which compiles all queries to parameterized statements with prepared values.
- **XSS & Content Sanitization**: Rich text from news/events sanitized with DOMPurify / sanitize-html before storage and rendering.

---

## 4. File Upload & Media Security

- **Strict File Type Whitelisting**:
  - Publications: `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`.
  - Images: `image/jpeg`, `image/png`, `image/webp`.
- **Payload Limits**:
  - Maximum 25MB for publication PDF documents.
  - Maximum 8MB for images.
- **Path Traversal Prevention**: Uploaded files are renamed using cryptographically secure UUIDs (`v4()`) with extension preservation. Stored outside public web root with controlled download streams.

---

## 5. Network & HTTP Security Headers

- **Helmet**: Enables HTTP Strict Transport Security (HSTS), X-Content-Type-Options (`nosniff`), X-Frame-Options (`DENY`), and Referrer-Policy.
- **CORS**: Strict whitelist restricted to configured frontend origins (`CLIENT_URL`).
