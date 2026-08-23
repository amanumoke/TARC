# Phase 1: Project Foundation & Monorepo Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the complete clean npm workspaces monorepo structure with `packages/shared`, `apps/server`, `apps/public`, and `apps/dashboard`, configuring shadcn UI primitives, Biome linting/formatting, Vitest runners, Docker Compose multi-container setup, and GitHub Actions CI.

**Architecture:** Monorepo with native npm workspaces, decoupled client applications (Public Web Portal: `apps/public` and Management Dashboard: `apps/dashboard` with React 19 + Vite + shadcn UI) and server (`apps/server` with Express + Node.js + Drizzle ORM), unified shared types and validation schemas package (`@tarcms/shared`).

**Tech Stack:** Node.js 20+, npm 10+, TypeScript 5+, shadcn UI (Radix UI, Tailwind CSS), Biome, Vitest, Docker, GitHub Actions.

## Global Constraints
- Native npm workspaces only (`workspaces: ["apps/*", "packages/*"]`), no Turborepo or Nx.
- Biome for all linting and formatting (`biome.json`).
- shadcn UI component system across both `apps/public` and `apps/dashboard`.
- All cross-boundary domain data types and validation schemas must live in `packages/shared`.
- All paths referenced in tasks must be exact.

---

### Task 1.1: Root Workspace & Monorepo Scaffolding

**Files:**
- Create: `package.json` (Root)
- Create: `biome.json`
- Create: `.gitignore`
- Create: `tsconfig.base.json`

**Interfaces:**
- Produces: Root workspace scripts (`npm run dev`, `npm run dev:public`, `npm run dev:dashboard`, `npm run dev:server`, `npm run build`, `npm run lint`, `npm run format`, `npm run test`, `npm run typecheck`).

- [ ] **Step 1: Write root `package.json` with npm workspaces configuration**

```json
{
  "name": "tarcms",
  "private": true,
  "version": "1.0.0",
  "description": "Tepi Agricultural Research Center Management System",
  "workspaces": [
    "packages/*",
    "apps/*"
  ],
  "scripts": {
    "dev": "npm run dev --workspaces --if-present",
    "dev:server": "npm run dev --workspace=@tarcms/server",
    "dev:public": "npm run dev --workspace=@tarcms/public",
    "dev:dashboard": "npm run dev --workspace=@tarcms/dashboard",
    "build": "npm run build --workspaces --if-present",
    "lint": "biome check .",
    "lint:fix": "biome check --write .",
    "format": "biome format --write .",
    "typecheck": "npm run typecheck --workspaces --if-present",
    "test": "npm run test --workspaces --if-present",
    "test:coverage": "npm run test:coverage --workspaces --if-present",
    "db:generate": "npm run db:generate --workspace=@tarcms/server",
    "db:migrate": "npm run db:migrate --workspace=@tarcms/server",
    "db:seed": "npm run db:seed --workspace=@tarcms/server"
  },
  "devDependencies": {
    "@biomejs/biome": "^1.9.4",
    "typescript": "^5.6.3"
  }
}
```

- [ ] **Step 2: Create root `biome.json` configuration**

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.4/schema.json",
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "files": {
    "ignoreUnknown": false,
    "ignore": ["node_modules", "dist", "build", "coverage", ".drizzle"]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "always"
    }
  }
}
```

- [ ] **Step 3: Create base TypeScript configuration `tsconfig.base.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

- [ ] **Step 4: Verify root configuration with Biome check**
Run: `npx @biomejs/biome check .`
Expected: PASS (Clean validation on root configuration files).

---

### Task 1.2: Shared Package Scaffolding (`packages/shared`)

**Files:**
- Create: `packages/shared/package.json`
- Create: `packages/shared/tsconfig.json`
- Create: `packages/shared/src/index.ts`
- Create: `packages/shared/src/types/index.ts`
- Create: `packages/shared/src/schemas/index.ts`
- Create: `packages/shared/src/constants/index.ts`
- Test: `packages/shared/src/schemas/index.test.ts`

**Interfaces:**
- Produces: `@tarcms/shared` module exportable into `@tarcms/server` and `@tarcms/web`.

- [ ] **Step 1: Write `packages/shared/package.json`**

```json
{
  "name": "@tarcms/shared",
  "version": "1.0.0",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "scripts": {
    "build": "tsc -b",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "dependencies": {
    "zod": "^3.23.8"
  },
  "devDependencies": {
    "typescript": "^5.6.3",
    "vitest": "^2.1.3"
  }
}
```

- [ ] **Step 2: Create `packages/shared/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

- [ ] **Step 3: Define foundational roles and constants in `packages/shared/src/constants/index.ts`**

```typescript
export const UserRole = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  RESEARCHER: 'RESEARCHER',
  STAFF: 'STAFF',
} as const;

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];

export const PublicationType = {
  JOURNAL_ARTICLE: 'JOURNAL_ARTICLE',
  CONFERENCE_PAPER: 'CONFERENCE_PAPER',
  TECHNICAL_MANUAL: 'TECHNICAL_MANUAL',
  VARIETY_RELEASE: 'VARIETY_RELEASE',
  POLICY_BRIEF: 'POLICY_BRIEF',
} as const;

export type PublicationTypeValue = (typeof PublicationType)[keyof typeof PublicationType];

export const VehicleStatus = {
  AVAILABLE: 'AVAILABLE',
  IN_USE: 'IN_USE',
  UNDER_MAINTENANCE: 'UNDER_MAINTENANCE',
  DECOMMISSIONED: 'DECOMMISSIONED',
} as const;

export type VehicleStatusValue = (typeof VehicleStatus)[keyof typeof VehicleStatus];

export const MessageStatus = {
  UNREAD: 'UNREAD',
  READ: 'READ',
  IN_PROGRESS: 'IN_PROGRESS',
  REPLIED: 'REPLIED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type MessageStatusValue = (typeof MessageStatus)[keyof typeof MessageStatus];
```

- [ ] **Step 4: Create initial Zod schemas in `packages/shared/src/schemas/index.ts`**

```typescript
import { z } from 'zod';
import { UserRole } from '../constants/index.js';

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export type LoginInput = z.infer<typeof LoginSchema>;

export const ContactFormSchema = z.object({
  senderName: z.string().min(2, 'Name must be at least 2 characters'),
  senderEmail: z.string().email('Valid email is required'),
  senderPhone: z.string().optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export type ContactFormInput = z.infer<typeof ContactFormSchema>;
```

- [ ] **Step 5: Write unit tests in `packages/shared/src/schemas/index.test.ts`**

```typescript
import { describe, it, expect } from 'vitest';
import { LoginSchema, ContactFormSchema } from './index.js';

describe('Shared Validation Schemas', () => {
  it('validates a correct login payload', () => {
    const valid = { email: 'admin@tarc.gov.et', password: 'password123' };
    expect(LoginSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects invalid email in login payload', () => {
    const invalid = { email: 'invalid-email', password: '123' };
    const result = LoginSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('validates contact form schema', () => {
    const contact = {
      senderName: 'Abebe Kebede',
      senderEmail: 'abebe@example.com',
      subject: 'Inquiry about coffee seedlings',
      message: 'Hello, I would like to purchase improved cardamom and coffee seedlings.',
    };
    expect(ContactFormSchema.safeParse(contact).success).toBe(true);
  });
});
```

- [ ] **Step 6: Run Vitest test suite in `packages/shared`**
Run: `npm run test --workspace=@tarcms/shared`
Expected: PASS (All shared schema tests pass).

---

### Task 1.3: Docker Compose & CI Workflow Configuration

**Files:**
- Create: `docker-compose.yml`
- Create: `docker-compose.prod.yml`
- Create: `.github/workflows/ci.yml`
- Create: `apps/server/Dockerfile`
- Create: `apps/public/Dockerfile`
- Create: `apps/public/nginx.conf`
- Create: `apps/dashboard/Dockerfile`
- Create: `apps/dashboard/nginx.conf`

- [ ] **Step 1: Write root `docker-compose.yml`**

```yaml
version: '3.8'

services:
  tarcms-db:
    image: mysql:8.0
    container_name: tarcms-mysql
    restart: unless-stopped
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: tarcms_db
      MYSQL_USER: tarc_user
      MYSQL_PASSWORD: tarc_password
    ports:
      - '3306:3306'
    volumes:
      - mysql_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      interval: 10s
      timeout: 5s
      retries: 5

  tarcms-server:
    build:
      context: .
      dockerfile: apps/server/Dockerfile
    container_name: tarcms-api
    restart: unless-stopped
    environment:
      NODE_ENV: development
      PORT: 5000
      DATABASE_URL: mysql://tarc_user:tarc_password@tarcms-db:3306/tarcms_db
      JWT_SECRET: super_secret_jwt_key_for_tarcms_development_2026
      CLIENT_URL: http://localhost:3000
    ports:
      - '5000:5000'
    depends_on:
      tarcms-db:
        condition: service_healthy
    volumes:
      - uploads_data:/app/apps/server/uploads

  tarcms-public:
    build:
      context: .
      dockerfile: apps/public/Dockerfile
    container_name: tarcms-public
    restart: unless-stopped
    ports:
      - '3000:80'
    depends_on:
      - tarcms-server

  tarcms-dashboard:
    build:
      context: .
      dockerfile: apps/dashboard/Dockerfile
    container_name: tarcms-dashboard
    restart: unless-stopped
    ports:
      - '3001:80'
    depends_on:
      - tarcms-server

volumes:
  mysql_data:
  uploads_data:
```

- [ ] **Step 2: Write `.github/workflows/ci.yml`**

```yaml
name: TARCMS CI Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  quality-gate:
    name: Lint, Typecheck & Tests
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Biome Linter & Formatter Check
        run: npx @biomejs/biome check .

      - name: TypeScript Typecheck
        run: npm run typecheck

      - name: Run Test Suites
        run: npm run test

      - name: Build Packages & Apps
        run: npm run build
```

- [ ] **Step 3: Verify GitHub workflow syntax with YAML lint / manual verification**
Expected: Valid GitHub Actions schema.
