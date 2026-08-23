# Phase 4: Admin Portal Foundation & Metrics Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the authenticated administrative dashboard shell, collapsible sidebar navigation, top header with profile controls, and the real-time operational overview metrics dashboard.

**Architecture:** Deep frontend layout module (`DashboardLayout`), React Router role-based navigation guards, and aggregated metrics API endpoint.

**Tech Stack:** React 19, React Router v6+, Lucide Icons, TanStack Query, Tailwind CSS, shadcn UI, Express.js.

## Global Constraints
- Sidebar items must be dynamically filtered by authenticated user role.
- Metric cards must display shadcn `Skeleton` loaders during data fetching.
- Seamless breadcrumb generation based on active URL route segments.

---

### Task 4.1: Dashboard Metrics API Endpoint

**Files:**
- Create: `apps/server/src/modules/dashboard/dashboard.service.ts`
- Create: `apps/server/src/modules/dashboard/dashboard.controller.ts`
- Create: `apps/server/src/modules/dashboard/dashboard.routes.ts`
- Test: `apps/server/src/modules/dashboard/dashboard.test.ts`

**Interfaces:**
- Produces: `GET /api/v1/admin/dashboard/metrics` returning `{ totalProjects, activeProjects, totalPublications, totalStaff, availableVehicles, unreadMessages }`.

- [ ] **Step 1: Write failing service test in `dashboard.test.ts`**
- [ ] **Step 2: Implement aggregation queries in `apps/server/src/modules/dashboard/dashboard.service.ts`**

```typescript
import { db } from '../../db/client.js';
import { sql } from 'drizzle-orm';
import { researchProjects, publications, staff, vehicles, contact_messages } from '../../db/schema/index.js';

export async function getDashboardMetrics() {
  const [projectCounts] = await db
    .select({
      total: sql<number>`count(*)`,
      active: sql<number>`sum(case when status = 'ONGOING' then 1 else 0 end)`,
    })
    .from(researchProjects);

  const [pubCounts] = await db
    .select({ total: sql<number>`count(*)` })
    .from(publications);

  const [staffCounts] = await db
    .select({ total: sql<number>`count(*)` })
    .from(staff);

  const [vehicleCounts] = await db
    .select({
      total: sql<number>`count(*)`,
      available: sql<number>`sum(case when status = 'AVAILABLE' then 1 else 0 end)`,
    })
    .from(vehicles);

  const [msgCounts] = await db
    .select({
      unread: sql<number>`sum(case when status = 'UNREAD' then 1 else 0 end)`,
    })
    .from(contact_messages);

  return {
    totalProjects: Number(projectCounts?.total || 0),
    activeProjects: Number(projectCounts?.active || 0),
    totalPublications: Number(pubCounts?.total || 0),
    totalStaff: Number(staffCounts?.total || 0),
    availableVehicles: Number(vehicleCounts?.available || 0),
    totalVehicles: Number(vehicleCounts?.total || 0),
    unreadMessages: Number(msgCounts?.unread || 0),
  };
}
```

- [ ] **Step 3: Register route in `apps/server/src/modules/dashboard/dashboard.routes.ts`**
- [ ] **Step 4: Run test to verify it passes**
Run: `npm run test --workspace=@tarcms/server`
Expected: PASS.

---

### Task 4.2: Frontend Dashboard Shell & Metric Cards (`apps/dashboard`)

**Files:**
- Create: `apps/dashboard/src/layouts/DashboardLayout.tsx`
- Create: `apps/dashboard/src/components/navigation/DashboardSidebar.tsx`
- Create: `apps/dashboard/src/components/navigation/DashboardHeader.tsx`
- Create: `apps/dashboard/src/features/dashboard/DashboardOverviewPage.tsx`
- Create: `apps/dashboard/src/components/ui/card.tsx` (shadcn Card)
- Create: `apps/dashboard/src/components/ui/skeleton.tsx` (shadcn Skeleton)
- Test: `apps/dashboard/src/features/dashboard/DashboardOverviewPage.test.tsx`

- [ ] **Step 1: Write shadcn Card and Skeleton primitives in `apps/dashboard/src/components/ui/`**
- [ ] **Step 2: Build `DashboardOverviewPage` with live TanStack Query metrics and shadcn Card layouts**
- [ ] **Step 3: Test Dashboard Overview rendering in `DashboardOverviewPage.test.tsx`**
Run: `npm run test --workspace=@tarcms/dashboard`
Expected: PASS.
