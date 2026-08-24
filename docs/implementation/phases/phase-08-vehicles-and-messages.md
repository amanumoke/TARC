# Phase 8: Operational Fleet & Visitor Inquiries Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

> **Development Workflow:** All implementation must follow the rules in [Development Workflow & Git Rules](../development/development-workflow-and-git-rules.md). Run `npm run validate` before pushing.

**Goal:** Implement center fleet management (vehicle inventory, status tracking, and dispatch assignment requisitions) and public contact inquiries moderation (message lifecycle status, admin reply notes, and inquiry queue).

**Architecture:** Status state machine for vehicles and contact messages, transactional assignment lifecycle, and responsive admin inbox.

**Tech Stack:** Express.js, Drizzle ORM, Zod, React 19, Lucide Icons, TanStack Query.

## Global Constraints
- Vehicle registration plates must be unique.
- Vehicle statuses: `AVAILABLE`, `IN_USE`, `UNDER_MAINTENANCE`, `DECOMMISSIONED`.
- Contact message lifecycle: `UNREAD` -> `READ` -> `IN_PROGRESS` -> `REPLIED` -> `ARCHIVED`.

## Code Quality Requirements

### Code Comments
- All exported functions, interfaces, and types must have JSDoc comments explaining their purpose
- Complex logic blocks must have inline comments explaining the reasoning
- Database queries must be commented explaining what data they fetch

### Commit Messages
- Use Conventional Commits format: `type(scope): description`
- Types: feat, fix, test, refactor, docs, chore
- Scope should match the domain (e.g., dashboard, staff, publications)
- Description should be imperative mood, lowercase, no period
- Example: `feat(staff): add photo upload endpoint with validation`

---

### Task 8.1: Fleet Management & Message Moderation Backend

**Files:**
- Create: `apps/server/src/modules/vehicles/vehicles.service.ts`
- Create: `apps/server/src/modules/vehicles/vehicles.controller.ts`
- Create: `apps/server/src/modules/messages/messages.service.ts`
- Create: `apps/server/src/modules/messages/messages.controller.ts`
- Create: `apps/server/src/modules/operations/operations.routes.ts`
- Test: `apps/server/src/modules/operations/operations.test.ts`

- [ ] **Step 1: Write tests for vehicle status transitions and assignment requests**

```typescript
import { describe, it, expect } from 'vitest';
import { updateVehicleStatus, assignVehicleTrip } from './vehicles.service.js';

describe('Vehicle Fleet Operations', () => {
  it('updates vehicle status correctly', async () => {
    const updated = await updateVehicleStatus('veh-1', 'IN_USE');
    expect(updated.status).toBe('IN_USE');
  });
});
```

- [ ] **Step 2: Implement vehicles and messages services**
- [ ] **Step 3: Register operations routes in Express app**
- [ ] **Step 4: Run test suite to verify it passes**
Run: `npm run test --workspace=@tarcms/server`
Expected: PASS.

---

### Task 8.2: Frontend Fleet Dashboard & Contact Inbox

**Files:**
- Create: `apps/web/src/features/admin/vehicles/AdminVehiclesPage.tsx`
- Create: `apps/web/src/features/admin/vehicles/VehicleModal.tsx`
- Create: `apps/web/src/features/admin/vehicles/VehicleRequisitionModal.tsx`
- Create: `apps/web/src/features/admin/messages/AdminMessagesPage.tsx`
- Create: `apps/web/src/features/admin/messages/MessageDetailDrawer.tsx`
- Create: `apps/web/src/features/public/contact/PublicContactPage.tsx`
- Test: `apps/web/src/features/public/contact/PublicContactPage.test.tsx`

- [ ] **Step 1: Build AdminVehiclesPage with color-coded status badges and assignment actions**
- [ ] **Step 2: Build AdminMessagesPage with filterable status tabs and reply notes logging drawer**
- [ ] **Step 3: Build PublicContactPage with validated message submission form and toast notification**
- [ ] **Step 4: Run frontend tests**
Run: `npm run test --workspace=@tarcms/web`
Expected: PASS.
