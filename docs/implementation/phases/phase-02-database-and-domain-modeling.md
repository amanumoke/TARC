# Phase 2: Database Schema & Domain Modeling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

> **Development Workflow:** All implementation must follow the rules in [Development Workflow & Git Rules](../development/development-workflow-and-git-rules.md). Run `npm run validate` before pushing.

**Goal:** Implement the complete MySQL 8.0 schema using Drizzle ORM, establish database connectivity and migration runners, and create an automated seed pipeline with realistic Tepi Agricultural Research Center domain data (Coffee, Spices, Forestry, Projects, Staff, and Vehicles).

**Architecture:** Type-safe relational schema modeling with Drizzle ORM (`mysql2`), explicit relational foreign keys, junction tables (`publication_authors`), and deterministic database seeder.

**Tech Stack:** MySQL 8.0, Drizzle ORM (`drizzle-orm`), Drizzle Kit (`drizzle-kit`), mysql2, Vitest.

## Global Constraints
- All table primary keys use UUID v4 (`varchar(36)`).
- Relational foreign keys must include explicit `onDelete` and `onUpdate` referential actions.
- Text search indices created on `publications (title, abstract)`.
- Realistic Ethiopian agricultural domain context (Tepi, Sheka zone, coffee varieties, cardamom, ginger, turmeric).

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

### Task 2.1: Drizzle Database Client & Configuration

**Files:**
- Create: `apps/server/drizzle.config.ts`
- Create: `apps/server/src/config/database.ts`
- Create: `apps/server/src/db/client.ts`
- Test: `apps/server/src/db/client.test.ts`

**Interfaces:**
- Produces: `db` client instance typed with full schema for repository operations.

- [x] **Step 1: Write `apps/server/drizzle.config.ts`**

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './src/db/migrations',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'mysql://tarc_user:tarc_password@localhost:3306/tarcms_db',
  },
  verbose: true,
  strict: true,
});
```

- [x] **Step 2: Create database connection pool in `apps/server/src/db/client.ts`**

```typescript
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema/index.js';

const connectionString = process.env.DATABASE_URL || 'mysql://tarc_user:tarc_password@localhost:3306/tarcms_db';

export const poolConnection = mysql.createPool({
  uri: connectionString,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const db = drizzle(poolConnection, { schema, mode: 'default' });
```

---

### Task 2.2: Drizzle Relational Schema Definition

**Files:**
- Create: `apps/server/src/db/schema/users.ts`
- Create: `apps/server/src/db/schema/departments.ts`
- Create: `apps/server/src/db/schema/staff.ts`
- Create: `apps/server/src/db/schema/research.ts`
- Create: `apps/server/src/db/schema/publications.ts`
- Create: `apps/server/src/db/schema/communication.ts`
- Create: `apps/server/src/db/schema/vehicles.ts`
- Create: `apps/server/src/db/schema/settings.ts`
- Create: `apps/server/src/db/schema/index.ts`

**Interfaces:**
- Produces: Complete exported Drizzle schema definitions and relations.

- [x] **Step 1: Write `apps/server/src/db/schema/research.ts`**

```typescript
import { mysqlTable, varchar, text, json, mysqlEnum, timestamp, int } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { departments } from './departments.js';
import { staff } from './staff.js';

export const researchPrograms = mysqlTable('research_programs', {
  id: varchar('id', { length: 36 }).primaryKey(),
  departmentId: varchar('department_id', { length: 36 }).notNull().references(() => departments.id, { onDelete: 'restrict' }),
  leadStaffId: varchar('lead_staff_id', { length: 36 }).references(() => staff.id, { onDelete: 'set null' }),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  description: text('description').notNull(),
  objectives: json('objectives').$type<string[]>(),
  status: mysqlEnum('status', ['PLANNED', 'ACTIVE', 'COMPLETED', 'SUSPENDED']).notNull().default('ACTIVE'),
  sortOrder: int('sort_order').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

export const researchProjects = mysqlTable('research_projects', {
  id: varchar('id', { length: 36 }).primaryKey(),
  programId: varchar('program_id', { length: 36 }).notNull().references(() => researchPrograms.id, { onDelete: 'restrict' }),
  departmentId: varchar('department_id', { length: 36 }).notNull().references(() => departments.id, { onDelete: 'restrict' }),
  leadResearcherId: varchar('lead_researcher_id', { length: 36 }).references(() => staff.id, { onDelete: 'set null' }),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  code: varchar('code', { length: 50 }).notNull().unique(),
  summary: text('summary').notNull(),
  objectives: json('objectives').$type<string[]>(),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  status: mysqlEnum('status', ['PROPOSED', 'ONGOING', 'COMPLETED', 'ON_HOLD']).notNull().default('ONGOING'),
  fundingSource: varchar('funding_source', { length: 150 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});
```

- [x] **Step 2: Write `apps/server/src/db/schema/publications.ts`**

```typescript
import { mysqlTable, varchar, text, mysqlEnum, int, boolean, bigint, timestamp } from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { researchProjects } from './research.js';
import { staff } from './staff.js';

export const publications = mysqlTable('publications', {
  id: varchar('id', { length: 36 }).primaryKey(),
  projectId: varchar('project_id', { length: 36 }).references(() => researchProjects.id, { onDelete: 'set null' }),
  title: varchar('title', { length: 300 }).notNull(),
  slug: varchar('slug', { length: 300 }).notNull().unique(),
  abstract: text('abstract').notNull(),
  publicationType: mysqlEnum('publication_type', [
    'JOURNAL_ARTICLE',
    'CONFERENCE_PAPER',
    'TECHNICAL_MANUAL',
    'VARIETY_RELEASE',
    'POLICY_BRIEF',
  ]).notNull().default('JOURNAL_ARTICLE'),
  publisherOrJournal: varchar('publisher_or_journal', { length: 200 }),
  publicationYear: int('publication_year').notNull(),
  doiUrl: varchar('doi_url', { length: 300 }),
  fileUrl: varchar('file_url', { length: 500 }),
  fileSizeBytes: bigint('file_size_bytes', { mode: 'number' }),
  peerReviewed: boolean('peer_reviewed').notNull().default(true),
  isFeatured: boolean('is_featured').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

export const publicationAuthors = mysqlTable('publication_authors', {
  id: varchar('id', { length: 36 }).primaryKey(),
  publicationId: varchar('publication_id', { length: 36 }).notNull().references(() => publications.id, { onDelete: 'cascade' }),
  staffId: varchar('staff_id', { length: 36 }).references(() => staff.id, { onDelete: 'set null' }),
  externalAuthorName: varchar('external_author_name', { length: 150 }),
  externalAffiliation: varchar('external_affiliation', { length: 200 }),
  authorOrder: int('author_order').notNull().default(1),
  isCorresponding: boolean('is_corresponding').notNull().default(false),
});
```

- [x] **Step 3: Export all schemas in `apps/server/src/db/schema/index.ts`**
- [x] **Step 4: Generate migration files with Drizzle Kit**
Run: `npm run db:generate --workspace=@tarcms/server`
Expected: SQL migration files created in `apps/server/src/db/migrations/`.

---

### Task 2.3: Realistic TARC Domain Seeder

**Files:**
- Create: `apps/server/src/db/seeds/tarc-seed.ts`

- [x] **Step 1: Write `tarc-seed.ts` populating Tepi agricultural data (Coffee, Spices, Vehicles, Projects)**
- [x] **Step 2: Execute seeder command**
Run: `npm run db:seed --workspace=@tarcms/server`
Expected: Database successfully populated with initial superadmin user, departments (Spices, Coffee, Protection), staff, projects, and vehicle records.
