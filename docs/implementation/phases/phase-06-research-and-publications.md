# Phase 6: Research Programs, Projects & Publications Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the central scientific output engine: hierarchical research programs, project trial tracking, scientific publication cataloging with multi-author junction mapping (`publication_authors`), PDF document uploads, and public faceted search.

**Architecture:** Relational hierarchy (`Department -> Program -> Project -> Publication`), transactional multi-author persistence, Multer file upload storage seam, and indexed full-text search.

**Tech Stack:** Express.js, Drizzle ORM, Multer, Zod, React 19, TanStack Query, Vitest.

## Global Constraints
- Every project must link to a valid Research Program.
- Publications can have both internal Staff authors and external collaborator affiliations.
- File upload size cap: 25MB for PDFs.

---

### Task 6.1: Research Programs & Projects Backend

**Files:**
- Create: `apps/server/src/modules/research/programs.service.ts`
- Create: `apps/server/src/modules/research/projects.service.ts`
- Create: `apps/server/src/modules/research/research.routes.ts`
- Test: `apps/server/src/modules/research/research.test.ts`

**Interfaces:**
- Produces: `CRUD /api/v1/admin/research-programs`, `CRUD /api/v1/admin/projects`, `GET /api/v1/public/research-programs`, `GET /api/v1/public/projects`.

- [ ] **Step 1: Write integration tests for program/project hierarchy**
- [ ] **Step 2: Implement relational queries linking Department -> Program -> Project**
- [ ] **Step 3: Run test suite to verify it passes**
Run: `npm run test --workspace=@tarcms/server`
Expected: PASS.

---

### Task 6.2: Publications & Multi-Author Engine with PDF Uploads

**Files:**
- Create: `apps/server/src/modules/publications/publications.service.ts`
- Create: `apps/server/src/modules/publications/publications.controller.ts`
- Create: `apps/server/src/modules/publications/publications.routes.ts`
- Create: `apps/server/src/storage/fileStorage.ts`
- Test: `apps/server/src/modules/publications/publications.test.ts`

**Interfaces:**
- Produces: `CRUD /api/v1/admin/publications`, `POST /api/v1/admin/upload`, `GET /api/v1/public/publications`.

- [ ] **Step 1: Write tests asserting multi-author creation and transactional atomicity**

```typescript
import { describe, it, expect } from 'vitest';
import { createPublicationWithAuthors } from './publications.service.js';

describe('Publications Service', () => {
  it('creates publication with internal staff and external authors', async () => {
    const pubData = {
      title: 'Performance of Cardamom Varieties in Tepi Ecosystem',
      slug: 'performance-cardamom-tepi-2026',
      abstract: 'Evaluation of yield parameters for improved cardamom accessions...',
      publicationType: 'JOURNAL_ARTICLE' as const,
      publicationYear: 2026,
      authors: [
        { staffId: 'staff-1', authorOrder: 1, isCorresponding: true },
        { externalAuthorName: 'Dr. John Doe', externalAffiliation: 'EIAR', authorOrder: 2 },
      ],
    };

    const created = await createPublicationWithAuthors(pubData);
    expect(created.id).toBeDefined();
    expect(created.authors.length).toBe(2);
  });
});
```

- [ ] **Step 2: Implement transactional creation in `publications.service.ts`**
- [ ] **Step 3: Implement Multer PDF file upload middleware**
- [ ] **Step 4: Run test suite to verify it passes**
Run: `npm run test --workspace=@tarcms/server`
Expected: PASS.

---

### Task 6.3: Frontend Research & Publications Portals

**Files:**
- Create: `apps/web/src/features/admin/publications/AdminPublicationsPage.tsx`
- Create: `apps/web/src/features/admin/publications/PublicationModal.tsx`
- Create: `apps/web/src/features/public/publications/PublicPublicationsPage.tsx`
- Create: `apps/web/src/features/public/research/PublicResearchPage.tsx`
- Test: `apps/web/src/features/public/publications/PublicPublicationsPage.test.tsx`

- [ ] **Step 1: Build PublicationModal with dynamic author rows and PDF drag-and-drop**
- [ ] **Step 2: Build Public Publications search page with type, year, and keyword filters**
- [ ] **Step 3: Run Vitest frontend tests**
Run: `npm run test --workspace=@tarcms/web`
Expected: PASS.
