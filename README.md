# TARCMS — Tepi Agricultural Research Center Management System

[![TARCMS CI](https://github.com/your-org/tarcms/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/tarcms/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.36-green.svg)](https://orm.drizzle.team/)
[![Biome](https://img.shields.io/badge/Linter-Biome-60a5fa.svg)](https://biomejs.dev/)

> **TARCMS** is the digital management and public institutional platform for the **Tepi Agricultural Research Center (TARC)** in Southwest Ethiopia. The platform combines a public-facing research discovery portal with an authenticated management system for research programs, scientific publications, staff directory, media gallery, operational vehicle tracking, and visitor inquiries.

---

## 🏛️ Project Architecture

This repository is organized as a high-performance **npm workspaces monorepo** with **shadcn UI** design system:

```
tarcms/
├── apps/
│   ├── public/                  # Public Institutional Web Portal & Portfolio (React 19, Vite, Tailwind CSS, shadcn UI, TanStack Query)
│   │   ├── src/                 # Research discovery, commodity showcases, publications catalog, contact
│   │   ├── Dockerfile           # Multi-stage client Dockerfile (Port 3000)
│   │   └── package.json
│   │
│   ├── dashboard/               # Authenticated Management Portal (React 19, Vite, Tailwind CSS, shadcn UI, TanStack Query)
│   │   ├── src/                 # Admin, researcher & staff dashboard, fleet tracking, publication manager
│   │   ├── Dockerfile           # Multi-stage dashboard Dockerfile (Port 3001)
│   │   └── package.json
│   │
│   └── server/                  # Backend Application (Node.js, Express, Drizzle ORM, MySQL)
│       ├── src/
│       │   ├── db/              # Drizzle schema, migrations, and agricultural seed scripts
│       │   ├── middleware/      # JWT auth, 4-tier RBAC, Zod validation, error handling
│       │   ├── modules/         # Deep domain modules (Research, Staff, News, Vehicles, Messages)
│       │   └── app.ts           # Express application setup
│       ├── Dockerfile           # Server Dockerfile (Port 5000)
│       └── package.json
│
├── packages/
│   └── shared/                  # Shared Domain Types, Enums, and Zod Validation Schemas
│       ├── src/                 # Single source of truth for frontend and backend contracts
│       └── package.json
│
├── docs/                        # Complete Technical Foundation & Design Documentation
│   ├── requirements/            # Requirements specification with certainty levels
│   ├── architecture/            # System architecture & component topology
│   ├── system-design/           # Domain entity models and deep module specifications
│   ├── database/                # MySQL 8.0 schema, indexes, and relational mappings
│   ├── workflows/               # Research lifecycle, vehicle tracking, and contact workflows
│   ├── api/                     # RESTful API endpoints and response contracts
│   ├── frontend/                # UI structure, layout hierarchy, and shadcn component library
│   ├── adr/                     # Architecture Decision Records (ADR 001 - 009)
│   ├── security/                # Security, RBAC, and data privacy architecture
│   ├── testing/                 # Test pyramid, unit/integration test strategies
│   ├── implementation/          # 10-Phase implementation roadmap and detailed phase plans
│   ├── deployment/              # Production deployment & operations guide
│   └── development/             # Git branching rules & conflict-free development workflow
│
├── .github/workflows/ci.yml     # Automated CI Quality Gate (Lint, Typecheck, Test, Build)
├── biome.json                   # Unified linter and formatter configuration
├── docker-compose.yml           # Local multi-container development orchestration
├── docker-compose.prod.yml      # Production container deployment orchestration
└── package.json                 # Monorepo root workspace configuration
```

---

## 🚀 Quick Start & Local Development

### 1. Prerequisites
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher
- **Docker & Docker Compose** (for running local MySQL)

### 2. Installation
```bash
# Clone repository
git clone https://github.com/your-org/tarcms.git
cd tarcms

# Install all monorepo dependencies across all workspaces
npm install

# Copy environment variables template
cp .env.example .env
```

### 3. Start Local MySQL Database with Docker
```bash
docker compose up -d tarcms-db
```

### 4. Run Migrations & Seed Realistic TARC Data
```bash
# Run Drizzle database migrations
npm run db:migrate

# Seed realistic TARC data (Coffee, Spices, Projects, Staff, Vehicles)
npm run db:seed
```

### 5. Start Full-Stack Development Servers
```bash
# Starts all workspaces simultaneously (public: 3000, dashboard: 3001, server: 5000)
npm run dev

# Or start specific applications:
npm run dev:public     # Starts Public Web Portal (http://localhost:3000)
npm run dev:dashboard  # Starts Admin Management Dashboard (http://localhost:3001)
npm run dev:server     # Starts Express REST API (http://localhost:5000)
```

---

## 🧪 Quality & Validation Commands

Always run the full validation suite locally before pushing any branch:

| Command | Purpose |
| :--- | :--- |
| **`npm run validate`** | **Executes Lint + Typecheck + Tests + Build sequentially** |
| `npm run lint` | Runs Biome linter and formatting checks across all workspaces |
| `npm run lint:fix` | Automatically fixes safe linting and formatting issues |
| `npm run typecheck` | Runs TypeScript type checking across all workspaces (`tsc --noEmit`) |
| `npm run test` | Executes all Vitest unit and integration test suites |
| `npm run build` | Builds all packages and compiles client/server for production |

---

## 🌿 Git Branching & Contribution Workflow

To maintain a conflict-free, reliable codebase:

1. **Protected `main` Branch**: Never commit directly to `main`.
2. **Dedicated Branch per Task**: Create a feature branch from latest `main`:
   ```bash
   git checkout -b feat/phase-01-monorepo-foundation
   ```
3. **Local Pre-Push Verification**: Run `npm run validate` before pushing.
4. **Conventional Commits**: Format commit messages cleanly (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`).

For full details, see the [Development Workflow & Git Rules](docs/development/development-workflow-and-git-rules.md).

---

## 🚢 Production Deployment

TARCMS is containerized and ready for single-command production deployment on any Linux host or VPS:

```bash
# Launch full production stack with health checks
docker compose -f docker-compose.prod.yml up -d --build

# Run database migrations in production
docker compose -f docker-compose.prod.yml exec tarcms-server npm run db:migrate
```

For complete instructions including Nginx reverse proxy configuration, automated SSL setup with Let's Encrypt, and daily database backup cron jobs, refer to the [Production Deployment Guide](docs/deployment/deployment-plan-and-guide.md).

---

## 📚 Technical Documentation Directory

| Document | Description |
| :--- | :--- |
| 📖 [**Requirements Specification**](docs/requirements/requirements-specification.md) | Functional & non-functional requirements with certainty tags |
| 🏗️ [**System Architecture**](docs/architecture/system-architecture.md) | Monorepo topology, layer seams, and Docker deployment |
| 🧩 [**System & Domain Design**](docs/system-design/system-design.md) | Deep module design for all 13 core institutional entities |
| 🗄️ [**Database Design**](docs/database/database-design.md) | MySQL 8.0 schema, indexes, constraints, and relational DDL |
| 🔄 [**Business Workflows**](docs/workflows/workflows.md) | Research lifecycle, vehicle dispatch, and visitor message moderation |
| 🌐 [**RESTful API Design**](docs/api/api-design.md) | Complete endpoints matrix, response envelopes, and query filters |
| 🎨 [**Frontend UI Structure**](docs/frontend/ui-structure.md) | Navigation, public/admin layouts, and atomic UI component system |
| 📜 [**Architecture Decision Records**](docs/adr/ADR-001-monorepo-workspaces.md) | ADR 001 - 008 documenting all major engineering decisions |
| 🔒 [**Security & Privacy Design**](docs/security/security-design.md) | Bcrypt, signed JWTs, 4-tier RBAC, and OWASP compliance |
| 🧪 [**Testing Strategy**](docs/testing/testing-strategy.md) | Vitest testing matrix and critical workflow test suites |
| 🗺️ [**Implementation Roadmap**](docs/implementation/implementation-plan.md) | 10-Phase detailed implementation roadmap |
| 📋 [**Traceability Matrix**](docs/traceability/traceability-matrix.md) | End-to-end mapping from concept requirements to code |
| ❓ [**Decisions & Open Questions**](docs/decisions/tarc-open-questions.md) | Official data approvals checklist required from TARC |

---

## 📄 License & Institutional Attribution

Prepared for the **Tepi Agricultural Research Center (TARC)**. All rights reserved.
