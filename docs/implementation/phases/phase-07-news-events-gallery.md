# Phase 7: News, Events & Media Gallery Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

> **Development Workflow:** All implementation must follow the rules in [Development Workflow & Git Rules](../development/development-workflow-and-git-rules.md). Run `npm run validate` before pushing.

**Goal:** Implement institutional communication tools: news article authoring with draft/published status, event scheduling and calendar management, and categorized photographic gallery management with lightbox viewing.

**Architecture:** Media processing seam with Multer, categorized album queries, chronological event filtering, and rich editorial UI components.

**Tech Stack:** Express.js, Drizzle ORM, Multer, React 19, Lucide Icons, Framer Motion.

## Global Constraints
- News articles support Markdown formatting and cover image uploads.
- Events must distinguish between upcoming and past dates.
- Gallery media assets must be organized by categories (`FIELD_TRIALS`, `LABORATORY`, `SPICE_VARIETIES`, `COFFEE_RESEARCH`, `COMMUNITY_OUTREACH`, `FACILITIES`).

---

### Task 7.1: News, Events & Gallery Backend Modules

**Files:**
- Create: `apps/server/src/modules/news/news.service.ts`
- Create: `apps/server/src/modules/news/news.controller.ts`
- Create: `apps/server/src/modules/events/events.service.ts`
- Create: `apps/server/src/modules/events/events.controller.ts`
- Create: `apps/server/src/modules/gallery/gallery.service.ts`
- Create: `apps/server/src/modules/gallery/gallery.controller.ts`
- Create: `apps/server/src/modules/communication/communication.routes.ts`
- Test: `apps/server/src/modules/communication/communication.test.ts`

- [ ] **Step 1: Write tests for news publishing status and event chronology**
- [ ] **Step 2: Implement news, events, and gallery services**
- [ ] **Step 3: Register communication routes in Express application**
- [ ] **Step 4: Run test suite to verify it passes**
Run: `npm run test --workspace=@tarcms/server`
Expected: PASS.

---

### Task 7.2: Frontend Communication & Media UI

**Files:**
- Create: `apps/web/src/features/admin/news/AdminNewsPage.tsx`
- Create: `apps/web/src/features/admin/news/NewsEditorModal.tsx`
- Create: `apps/web/src/features/admin/events/AdminEventsPage.tsx`
- Create: `apps/web/src/features/admin/events/EventModal.tsx`
- Create: `apps/web/src/features/admin/gallery/AdminGalleryPage.tsx`
- Create: `apps/web/src/features/public/news/PublicNewsPage.tsx`
- Create: `apps/web/src/features/public/events/PublicEventsPage.tsx`
- Create: `apps/web/src/features/public/gallery/PublicGalleryPage.tsx`
- Test: `apps/web/src/features/public/gallery/PublicGalleryPage.test.tsx`

- [ ] **Step 1: Implement NewsEditorModal with Markdown formatting preview**
- [ ] **Step 2: Implement Events calendar list with date badge formatting**
- [ ] **Step 3: Build Gallery media grid with lightbox zoom modal**
- [ ] **Step 4: Run frontend test suite**
Run: `npm run test --workspace=@tarcms/web`
Expected: PASS.
