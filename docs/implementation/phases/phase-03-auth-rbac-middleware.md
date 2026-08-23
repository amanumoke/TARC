# Phase 3: Authentication, RBAC & Core API Middleware Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement stateless JWT authentication, password hashing with bcrypt, 4-tier Role-Based Access Control (`SUPER_ADMIN`, `ADMIN`, `RESEARCHER`, `STAFF`), request payload validation middleware with Zod, and frontend authentication context provider.

**Architecture:** Token-based authentication with Bearer JWTs, declarative route guards, Zod middleware validation, and centralized exception handling.

**Tech Stack:** Express.js, TypeScript, jsonwebtoken, bcryptjs, Zod, Vitest, Supertest, React 19.

## Global Constraints
- Passwords must be hashed with `bcryptjs` (salt rounds >= 10).
- JWT expiration set to 24 hours.
- 401 Unauthorized for missing/invalid tokens; 403 Forbidden for insufficient role permissions.

---

### Task 3.1: Password Hashing & JWT Token Utilities

**Files:**
- Create: `apps/server/src/utils/security.ts`
- Test: `apps/server/src/utils/security.test.ts`

**Interfaces:**
- Produces: `hashPassword(password: string): Promise<string>`, `verifyPassword(plain: string, hash: string): Promise<boolean>`, `generateToken(payload: AuthTokenPayload): string`, `verifyToken(token: string): AuthTokenPayload`.

- [ ] **Step 1: Write failing test in `apps/server/src/utils/security.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, generateToken, verifyToken } from './security.js';

describe('Security Utilities', () => {
  it('hashes and verifies a password correctly', async () => {
    const raw = 'tarc_secret_2026';
    const hash = await hashPassword(raw);
    expect(hash).not.toBe(raw);
    expect(await verifyPassword(raw, hash)).toBe(true);
    expect(await verifyPassword('wrong_password', hash)).toBe(false);
  });

  it('generates and verifies signed JWT tokens', () => {
    const payload = { id: 'usr-123', email: 'admin@tarc.gov.et', role: 'ADMIN' as const };
    const token = generateToken(payload);
    const decoded = verifyToken(token);
    expect(decoded.id).toBe(payload.id);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe(payload.role);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**
Run: `npm run test --workspace=@tarcms/server`
Expected: FAIL with "functions not defined".

- [ ] **Step 3: Implement minimal code in `apps/server/src/utils/security.ts`**

```typescript
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRoleType } from '@tarcms/shared';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_tarcms_2026';
const SALT_ROUNDS = 10;

export interface AuthTokenPayload {
  id: string;
  email: string;
  role: UserRoleType;
}

export async function hashPassword(plainText: string): Promise<string> {
  return bcrypt.hash(plainText, SALT_ROUNDS);
}

export async function verifyPassword(plainText: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}

export function generateToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): AuthTokenPayload {
  return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
}
```

- [ ] **Step 4: Run test to verify it passes**
Run: `npm run test --workspace=@tarcms/server`
Expected: PASS.

---

### Task 3.2: Express Middleware (Auth, RBAC, Validator, Error Handler)

**Files:**
- Create: `apps/server/src/middleware/auth.ts`
- Create: `apps/server/src/middleware/rbac.ts`
- Create: `apps/server/src/middleware/validate.ts`
- Create: `apps/server/src/middleware/errorHandler.ts`
- Test: `apps/server/src/middleware/auth.test.ts`

**Interfaces:**
- Produces: Express middleware functions `authenticateToken`, `requireRole`, `validateBody`, `errorHandler`.

- [ ] **Step 1: Implement `apps/server/src/middleware/auth.ts`**

```typescript
import { Request, Response, NextFunction } from 'express';
import { verifyToken, AuthTokenPayload } from '../utils/security.js';

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Access token required.' } });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Token is invalid or expired.' } });
  }
}
```

- [ ] **Step 2: Implement `apps/server/src/middleware/rbac.ts`**

```typescript
import { Response, NextFunction } from 'express';
import { UserRoleType } from '@tarcms/shared';
import { AuthenticatedRequest } from './auth.js';

export function requireRole(...allowedRoles: UserRoleType[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Authentication required.' } });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permission for this operation.' }
      });
    }

    next();
  };
}
```

- [ ] **Step 3: Run middleware integration tests**
Run: `npm run test --workspace=@tarcms/server`
Expected: PASS.
