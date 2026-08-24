# Phase 10: System Integration, Security Hardening & Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

> **Development Workflow:** All implementation must follow the rules in [Development Workflow & Git Rules](../development/development-workflow-and-git-rules.md). Run `npm run validate` before pushing.

**Goal:** Execute full system end-to-end integration testing, apply security hardening (Helmet, rate-limiting, CORS, input sanitization), configure production multi-stage Docker builds, and finalize deployment documentation.

**Architecture:** Automated integration test harness, production Nginx reverse proxy container, rate-limiting middleware, and zero-downtime containerized release topology.

**Tech Stack:** Docker, Nginx, Express.js, Helmet, express-rate-limit, Vitest, Supertest.

## Global Constraints
- Rate limiting: 100 requests per 15 minutes for general public endpoints, 5 requests per 15 minutes for auth endpoints.
- Production build must generate zero TypeScript or Biome errors.
- Single command production deployment (`docker compose -f docker-compose.prod.yml up -d`).

---

### Task 10.1: Security Middleware & Rate Limiting Hardening

**Files:**
- Create: `apps/server/src/middleware/security.ts`
- Create: `apps/server/src/middleware/rateLimiter.ts`
- Modify: `apps/server/src/app.ts`
- Test: `apps/server/src/middleware/security.test.ts`

- [ ] **Step 1: Write rate-limiting and security header integration tests**
- [ ] **Step 2: Implement Helmet and express-rate-limit configurations**

```typescript
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { Express } from 'express';

export function applySecurityMiddleware(app: Express) {
  app.use(helmet());
  app.use(
    cors({
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true,
    })
  );

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { success: false, error: { code: 'TOO_MANY_REQUESTS', message: 'Too many login attempts. Please try again later.' } },
  });

  app.use('/api/v1/auth/login', authLimiter);
}
```

- [ ] **Step 3: Run security tests to verify headers and rate limiting**
Run: `npm run test --workspace=@tarcms/server`
Expected: PASS.

---

### Task 10.2: End-to-End Workflow Verification Suite

**Files:**
- Create: `apps/server/src/__tests__/e2e-workflow.test.ts`

- [ ] **Step 1: Write comprehensive end-to-end workflow test**
  1. Authenticate as Super Admin.
  2. Create Department ("Spices Research").
  3. Create Research Program ("Korarima & Cardamom").
  4. Create Research Project ("Cardamom Yield Trial 2026").
  5. Publish Research Paper with internal and external authors.
  6. Query Public Publication Search and assert correct data returned.
  7. Submit Public Contact Message -> Verify in Admin Inbox -> Update status to Replied.
  8. Submit Vehicle Requisition -> Approve Requisition -> Update status to Completed.

- [ ] **Step 2: Execute end-to-end integration test suite**
Run: `npm run test --workspace=@tarcms/server`
Expected: PASS (All integration workflows succeed).

---

### Task 10.3: Production Docker & Deployment Verification

**Files:**
- Create: `docker-compose.prod.yml`
- Create: `apps/server/Dockerfile.prod`
- Create: `apps/web/Dockerfile.prod`
- Create: `docs/deployment/production-guide.md`

- [ ] **Step 1: Write `docker-compose.prod.yml` with health checks and restart policies**
- [ ] **Step 2: Test production container build**
Run: `docker compose -f docker-compose.prod.yml build`
Expected: Zero build errors.
- [ ] **Step 3: Write operator deployment manual in `docs/deployment/production-guide.md`**
