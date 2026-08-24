# Phase 5: Departments & Staff Domain Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

> **Development Workflow:** All implementation must follow the rules in [Development Workflow & Git Rules](../development/development-workflow-and-git-rules.md). Run `npm run validate` before pushing.

**Goal:** Implement full CRUD management and public discovery for TARC departments and staff personnel, including department head links, staff photo uploads, expertise tagging, and public staff rosters.

**Architecture:** Deep domain modules (`departments`, `staff`) with transactional repository layers and reusable data table / modal interfaces.

**Tech Stack:** Express.js, Drizzle ORM, Zod, React 19, React Hook Form, TanStack Query.

## Global Constraints
- Department `code` must be unique (e.g. `DEPT-SPICE`).
- Staff members must be linked to a valid department.
- Public staff directory only shows active staff (`isActive: true`).

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

### Task 5.1: Departments Backend Module

**Files:**
- Create: `apps/server/src/modules/departments/departments.service.ts`
- Create: `apps/server/src/modules/departments/departments.controller.ts`
- Create: `apps/server/src/modules/departments/departments.routes.ts`
- Test: `apps/server/src/modules/departments/departments.test.ts`

**Interfaces:**
- Produces: `GET /api/v1/public/departments`, `GET /api/v1/admin/departments`, `POST /api/v1/admin/departments`, `PUT /api/v1/admin/departments/:id`, `DELETE /api/v1/admin/departments/:id`.

- [ ] **Step 1: Write failing tests for department operations in `departments.test.ts`**
- [ ] **Step 2: Implement department service and repository methods**
- [ ] **Step 3: Register department routes in Express app**
- [ ] **Step 4: Run test to verify it passes**
Run: `npm run test --workspace=@tarcms/server`
Expected: PASS.

---

### Task 5.2: Staff Personnel Backend Module

**Files:**
- Create: `apps/server/src/modules/staff/staff.service.ts`
- Create: `apps/server/src/modules/staff/staff.controller.ts`
- Create: `apps/server/src/modules/staff/staff.routes.ts`
- Test: `apps/server/src/modules/staff/staff.test.ts`

**Interfaces:**
- Produces: `GET /api/v1/public/staff`, `CRUD /api/v1/admin/staff`.

- [ ] **Step 1: Write staff CRUD unit and integration tests**
- [ ] **Step 2: Implement staff service handling expertise JSON parsing and photo links**
- [ ] **Step 3: Run test suite to verify it passes**
Run: `npm run test --workspace=@tarcms/server`
Expected: PASS.

---

### Task 5.3: Frontend Department & Staff Management UI

**Files:**
- Create: `apps/web/src/features/admin/departments/AdminDepartmentsPage.tsx`
- Create: `apps/web/src/features/admin/departments/DepartmentModal.tsx`
- Create: `apps/web/src/features/admin/staff/AdminStaffPage.tsx`
- Create: `apps/web/src/features/admin/staff/StaffModal.tsx`
- Create: `apps/web/src/features/public/departments/PublicDepartmentsPage.tsx`
- Create: `apps/web/src/features/public/staff/PublicStaffDirectoryPage.tsx`
- Test: `apps/web/src/features/admin/staff/AdminStaffPage.test.tsx`

- [ ] **Step 1: Build Department and Staff CRUD modal forms with React Hook Form + Zod**
- [ ] **Step 2: Build Public Department and Staff Directory responsive grids**
- [ ] **Step 3: Verify with component test suite**
Run: `npm run test --workspace=@tarcms/web`
Expected: PASS.
