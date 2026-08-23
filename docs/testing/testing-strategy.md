# TARCMS Comprehensive Testing Strategy

> **Framework**: Vitest (`packages/shared`, `apps/server`, `apps/web`)  
> **Testing Philosophy**: Deep Module Testing — Interface is the test surface; test observable outcomes, not private internals.

---

## 1. Test Pyramid Overview

```
                   /\
                  /  \     E2E / Workflow Tests (Playwright / Supertest Flows)
                 /----\    - Complete Publication Submission to Public Discovery
                /      \   - Vehicle Requisition & Approval Lifecycle
               /--------\  Integration & API Tests (Vitest + Supertest)
              /          \ - Express API Endpoints & Auth Middleware
             /------------\- Drizzle ORM Queries & Database Transactions
            /              \ Unit Tests (Vitest + React Testing Library)
           /----------------\ - Zod Schemas & Validation Logic in @tarcms/shared
                              - Domain Utility Functions & UI Primitives
```

---

## 2. Test Execution Matrix

| Test Layer | Target Directory | Tooling | Coverage Target |
| :--- | :--- | :--- | :--- |
| **Shared Schemas** | `packages/shared/src/**/*.test.ts` | Vitest | 100% on validation rules, type guards, and DTO parsing. |
| **Backend Services** | `apps/server/src/modules/**/*.test.ts` | Vitest, Supertest | 90%+ on business logic, authorization guards, error modes. |
| **API Endpoints** | `apps/server/src/__tests__/**/*.test.ts` | Vitest, Supertest, SQLite/MySQL Test DB | HTTP response envelopes, status codes, query filters. |
| **Frontend UI** | `apps/web/src/**/*.test.tsx` | Vitest, React Testing Library | Navigation guards, form validations, data table sorting. |

---

## 3. Critical Workflow Integration Tests

1. **Authentication Flow**:
   - Register/Seed admin -> Login with valid credentials -> Receive JWT -> Access protected `/api/v1/admin/dashboard/metrics` (200 OK) -> Access without token (401 Unauthorized) -> Access with insufficient role (403 Forbidden).
2. **Research & Publication Hierarchy Flow**:
   - Create Department -> Create Research Program under Department -> Create Research Project under Program -> Publish Scientific Publication linked to Project with multiple authors -> Query `/api/v1/public/publications?search=cardamom` -> Verify correct relational payload returned.
3. **Vehicle Fleet Lifecycle Flow**:
   - Register vehicle -> Create pending assignment requisition -> Approve requisition (Vehicle status becomes `IN_USE`) -> Complete trip (Vehicle status returns to `AVAILABLE`).
4. **Contact Message Moderation Flow**:
   - Public user submits contact inquiry -> Message enters queue as `UNREAD` -> Admin retrieves inbox -> Marks as `READ` -> Submits reply notes (Status `REPLIED`) -> Archives message.
