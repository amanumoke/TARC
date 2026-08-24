# Phase 9: Public Institutional Web Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

> **Development Workflow:** All implementation must follow the rules in [Development Workflow & Git Rules](../development/development-workflow-and-git-rules.md). Run `npm run validate` before pushing.

**Goal:** Assemble and polish the complete public website: Home page with hero banner, dynamic statistics counters, featured research highlights, About Us page, Director's Welcome, and responsive navigation header and footer using shadcn UI.

**Architecture:** Public layout shell (`PublicLayout`), mobile navigation drawer with shadcn `Sheet` and Framer Motion, responsive typography, and SEO-friendly metadata.

**Tech Stack:** React 19, Tailwind CSS, shadcn UI, Lucide Icons, Framer Motion, React Router v6+.

## Global Constraints
- Mobile-first responsive design (320px to 4K displays).
- Accessible contrast ratios (WCAG 2.1 AA compliant).
- Fast load times with lazy-loaded image assets and clean shadcn `Skeleton` loaders.

---

### Task 9.1: Public Navigation Shell & Layout (`apps/public`)

**Files:**
- Create: `apps/public/src/layouts/PublicLayout.tsx`
- Create: `apps/public/src/components/navigation/PublicHeader.tsx`
- Create: `apps/public/src/components/navigation/PublicFooter.tsx`
- Create: `apps/public/src/components/navigation/MobileNavDrawer.tsx`
- Create: `apps/public/src/components/ui/button.tsx` (shadcn Button)
- Test: `apps/public/src/layouts/PublicLayout.test.tsx`

- [ ] **Step 1: Implement PublicHeader with TARC logo branding, navigation links, shadcn Buttons, and mobile toggle**
- [ ] **Step 2: Implement PublicFooter with institutional coordinates, quick links, and copyright**
- [ ] **Step 3: Test layout rendering across mobile and desktop viewport mockups**
Run: `npm run test --workspace=@tarcms/public`
Expected: PASS.

---

### Task 9.2: Public Home Page & Institutional Identity Pages (`apps/public`)

**Files:**
- Create: `apps/public/src/features/home/PublicHomePage.tsx`
- Create: `apps/public/src/features/home/HeroBanner.tsx`
- Create: `apps/public/src/features/home/StatsCounter.tsx`
- Create: `apps/public/src/features/home/FeaturedResearchSection.tsx`
- Create: `apps/public/src/features/about/PublicAboutPage.tsx`
- Create: `apps/public/src/features/director/PublicDirectorPage.tsx`
- Create: `apps/public/src/components/ui/card.tsx` (shadcn Card)
- Create: `apps/public/src/components/ui/badge.tsx` (shadcn Badge)
- Test: `apps/public/src/features/home/PublicHomePage.test.tsx`

- [ ] **Step 1: Build HeroBanner with high-impact agricultural backdrop and call-to-action buttons**
- [ ] **Step 2: Build dynamic StatsCounter showing active projects, published papers, and varieties released**
- [ ] **Step 3: Build PublicAboutPage with institutional mandate, mission, and vision cards using shadcn Cards**
- [ ] **Step 4: Build PublicDirectorPage with leadership photo and official welcome address**
- [ ] **Step 5: Run frontend test suite**
Run: `npm run test --workspace=@tarcms/public`
Expected: PASS.
