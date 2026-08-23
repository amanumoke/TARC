# TARCMS System Architecture

> **Document Status**: Complete Technical Architecture  
> **Target Topology**: npm Workspaces Monorepo (`apps/public`, `apps/dashboard`, `apps/server`, `packages/shared`)  
> **UI System**: shadcn UI (Tailwind CSS, Radix UI Primitives, Lucide Icons)

---

## 1. High-Level Architectural Diagram

```
+---------------------------------------------------------------------------------------------------+
|                                          CLIENT LAYER                                             |
|                                                                                                   |
|  +--------------------------------------------+   +---------------------------------------------+ |
|  |     Public Portal (apps/public)            |   |  Management Dashboard (apps/dashboard)      | |
|  |     React 19 / Vite / shadcn UI            |   |  React 19 / Vite / shadcn UI                | |
|  |     - Institutional Branding & Portfolio   |   |  - 4-Tier Role-Guarded Admin Routes         | |
|  |     - Research & Publication Finder        |   |  - Entity CRUD & Rich Content Editing       | |
|  |     - Events / News / Gallery Showcase     |   |  - Vehicle Fleet Tracking & Assignment Logs | |
|  |     - Visitor Inquiries & Feedback Forms   |   |  - Contact Moderation Inbox & System Config | |
|  +--------------------------------------------+   +---------------------------------------------+ |
|                     \                                              /                              |
|                      \------------------ TanStack Query ----------/                               |
|                                                |                                                  |
|                                           HTTP / JSON                                             |
+------------------------------------------------|--------------------------------------------------+
                                                 v
+---------------------------------------------------------------------------------------------------+
|                                          SERVER LAYER                                             |
|                                                                                                   |
|  +----------------------------------------------------------------------------------------------+ |
|  |                      Express.js TypeScript Application (apps/server)                         | |
|  |  +----------------+  +-------------------------+  +------------------+                       | |
|  |  | Auth & Security|  | Domain Routers & Modules|  | File Handling    |                       | |
|  |  | - JWT / Bcrypt |  | - Research / Pubs       |  | - Multer Uploads |                       | |
|  |  | - RBAC Guard   |  | - Vehicles / Messages   |  | - Local/S3 Seam  |                       | |
|  |  | - Rate Limiter |  | - Settings / Staff      |  | - Doc / Media    |                       | |
|  |  +----------------+  +-------------------------+  +------------------+                       | |
|  |                               |                                                                | |
|  |                               v                                                                | |
|  |  +----------------------------------------------------------------------------------------+  | |
|  |  |                              Service / Business Logic Layer                            |  | |
|  |  | - Invariant Checks          - State Transitions          - Deep Domain Operations      |  | |
|  |  +----------------------------------------------------------------------------------------+  | |
|  |                               |                                                                | |
|  |                               v                                                                | |
|  |  +----------------------------------------------------------------------------------------+  | |
|  |  |                            Drizzle ORM Data Access Layer                               |  | |
|  |  | - Type-Safe Query Builder   - Relational Joins           - Migrations & Seeds          |  | |
|  |  +----------------------------------------------------------------------------------------+  | |
|  +----------------------------------------------------------------------------------------------+ |
+------------------------------------------------|--------------------------------------------------+
                                                 v
+---------------------------------------------------------------------------------------------------+
|                                      DATA & STORAGE LAYER                                         |
|                                                                                                   |
|  +------------------------------------+             +-------------------------------------------+ |
|  |          MySQL 8.0 Database        |             |            Media / File Storage           | |
|  |  - Relational Schema & Foreign Keys|             |  - Uploaded Publication PDFs              | |
|  |  - Indexes & Unique Constraints    |             |  - Gallery Images & Thumbnails            | |
|  |  - Full-Text Search Indices        |             |  - Staff Portraits & News Banners         | |
|  +------------------------------------+             +-------------------------------------------+ |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Monorepo Organization

```
tarcms/
├── apps/
│   ├── public/                  # Public Institutional Web Portal & Portfolio (Port 3000)
│   │   ├── src/
│   │   │   ├── components/      # shadcn UI components (ui/button, ui/card, ui/dialog, etc.)
│   │   │   ├── features/        # Public features (home, about, research, publications, contact)
│   │   │   ├── hooks/           # Reusable React hooks
│   │   │   ├── lib/             # API client, TanStack queryClient, utils (cn)
│   │   │   └── styles/          # Tailwind CSS + shadcn theme variables
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   ├── dashboard/               # Authenticated Operations & Admin Dashboard (Port 3001)
│   │   ├── src/
│   │   │   ├── components/      # shadcn UI components (ui/table, ui/select, ui/tabs, ui/modal)
│   │   │   ├── features/        # Admin modules (research-mgmt, staff-mgmt, fleet, messages)
│   │   │   ├── hooks/           # Auth hook, debounce, media queries
│   │   │   ├── lib/             # Auth storage, API client, utils (cn)
│   │   │   └── styles/          # Tailwind CSS + shadcn dashboard theme
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── vite.config.ts
│   │
│   └── server/                  # Backend Application (Node.js + Express + TypeScript) (Port 5000)
│       ├── src/
│       │   ├── config/          # Environment configuration, database credentials
│       │   ├── db/              # Drizzle ORM schema, client connection, migrations, seeds
│       │   │   ├── schema/      # Table definitions per domain
│       │   │   ├── migrations/  # Drizzle generated SQL migrations
│       │   │   └── seeds/       # Realistic TARC domain seed datasets
│       │   ├── middleware/      # Auth guard, RBAC guard, validator, error handler
│       │   ├── modules/         # Deep domain backend modules (controller, service, repository)
│       │   │   ├── auth/
│       │   │   ├── departments/
│       │   │   ├── staff/
│       │   │   ├── research-programs/
│       │   │   ├── research-projects/
│       │   │   ├── publications/
│       │   │   ├── news/
│       │   │   ├── events/
│       │   │   ├── gallery/
│       │   │   ├── vehicles/
│       │   │   ├── messages/
│       │   │   └── settings/
│       │   ├── storage/         # File storage seam (Local Disk / S3 Adapter)
│       │   └── app.ts           # Express application bootstrap
│       ├── Dockerfile
│       └── package.json
│
├── packages/
│   └── shared/                  # Shared Domain Types, Zod Schemas & DTOs
│       ├── src/
│       │   ├── types/           # Shared TypeScript interfaces & types
│       │   ├── schemas/         # Shared Zod validation schemas
│       │   ├── constants/       # Enums, roles, status constants
│       │   └── index.ts
│       └── package.json
│
├── .github/
│   └── workflows/
│       └── ci.yml               # Automated CI pipeline (Biome, TypeCheck, Vitest, Docker)
├── biome.json                   # Monorepo unified formatting and linting configuration
├── docker-compose.yml           # Multi-container orchestration (MySQL + API + Client)
├── package.json                 # Root npm workspace configuration
└── README.md
```

---

## 3. Layer Responsibilities & Design Seams

### 3.1 Client Layer (`apps/web`)
- **Technology**: React 19, Vite, Tailwind CSS, TanStack Query v5, React Hook Form, Zod, Lucide React.
- **Seam**: Consumes the backend strictly through a type-safe HTTP client (`apiClient`) typed with `@tarcms/shared`.
- **Public Domain**: SEO-friendly, highly accessible presentation of research outputs, staff, departments, news, events, and visitor messaging.
- **Admin Domain**: Authenticated management console with role-based routing (`RequireAuth`, `RequireRole`), rich data tables, modal forms, and real-time dashboard metrics.

### 3.2 Shared Layer (`packages/shared`)
- **Technology**: TypeScript, Zod.
- **Responsibility**: Single source of truth for domain contracts, request/response DTOs, enum values, and validation rules. Prevents frontend-backend schema drift.

### 3.3 Server Layer (`apps/server`)
- **Technology**: Express.js, TypeScript, Drizzle ORM, Zod, Bcrypt, JsonWebToken.
- **Architecture**: Modular 3-tier architecture per domain (Route/Controller -> Domain Service -> Repository/ORM).
- **Security Seam**:
  - `authenticateToken`: Validates Bearer JWT tokens and attaches authenticated user context.
  - `requireRole(...roles)`: Enforces 4-tier Role-Based Access Control (`SUPER_ADMIN`, `ADMIN`, `RESEARCHER`, `STAFF`).
  - `validateBody(schema)` / `validateQuery(schema)`: Validates incoming payloads against shared Zod schemas before hitting business logic.

### 3.4 Data & Storage Layer
- **Database**: MySQL 8.0 (InnoDB engine, utf8mb4 character set for multi-language support, ACID compliance).
- **ORM**: Drizzle ORM providing type-safe SQL queries, explicit relations, and zero-runtime overhead.
- **File Storage**: Modular `FileStorageService` seam. Local disk storage in development (`/uploads`), swappable with AWS S3 / MinIO in production without modifying business controllers.

---

## 4. Deployment & Infrastructure Architecture

```
                                 [ Internet / User Traffic ]
                                             |
                                             v
                      +---------------------------------------------+
                      |         Nginx / Cloud Reverse Proxy         |
                      |   - SSL / TLS Termination                   |
                      |   - Static Asset Caching                    |
                      +---------------------------------------------+
                                     /             \
                       /api traffic /               \ static assets
                                   v                 v
            +---------------------------+   +---------------------------+
            |  tarcms-server (Node.js)  |   |    tarcms-web (Nginx SPA) |
            |  Port: 5000               |   |    Port: 80               |
            +---------------------------+   +---------------------------+
                           |
                           v
            +---------------------------+
            |   MySQL 8.0 Container     |
            |   Port: 3306 (Internal)   |
            |   Named Volume: db_data   |
            +---------------------------+
```
