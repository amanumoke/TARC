# TARCMS Implementation Roadmap & Phase Plans Index

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task.  
> **Structure**: 10 Step-by-Step Delivery Phases with Detailed Plans, Explicit Dependencies, API Contracts, Database Migrations, and Acceptance Criteria.

---

## Detailed Phase Plans Directory

| Phase | Title | Objective & Scope | Detailed Plan Link |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Project Foundation & Monorepo Setup | npm workspaces (`apps/public`, `apps/dashboard`, `apps/server`, `packages/shared`), shadcn UI setup, Biome, Docker, Vitest, CI | [**Phase 1 Plan**](phases/phase-01-foundation-and-monorepo.md) |
| **Phase 2** | Database & Domain Modeling | MySQL 8.0 schema, Drizzle ORM models, migrations, rich TARC seeds | [**Phase 2 Plan**](phases/phase-02-database-and-domain-modeling.md) |
| **Phase 3** | Auth, RBAC & Core Middleware | JWT tokens, bcrypt hashing, 4-tier RBAC guards, Zod request validators | [**Phase 3 Plan**](phases/phase-03-auth-rbac-middleware.md) |
| **Phase 4** | Admin Dashboard Foundation & Metrics | `apps/dashboard` shell, shadcn sidebar navigation, summary KPI metric cards | [**Phase 4 Plan**](phases/phase-04-admin-foundation-dashboard.md) |
| **Phase 5** | Departments & Staff Domain | Department management, staff directory CRUD, public roster with shadcn Cards | [**Phase 5 Plan**](phases/phase-05-departments-and-staff.md) |
| **Phase 6** | Research Programs, Projects & Publications | Program/project hierarchy, publication catalog, multi-author mapping, PDF upload | [**Phase 6 Plan**](phases/phase-06-research-and-publications.md) |
| **Phase 7** | News, Events & Media Gallery | Editorial news publishing, events calendar, categorized gallery albums | [**Phase 7 Plan**](phases/phase-07-news-events-gallery.md) |
| **Phase 8** | Fleet Management & Visitor Messages | Vehicle tracking, assignment logs, contact message moderation inbox with shadcn Tables | [**Phase 8 Plan**](phases/phase-08-vehicles-and-messages.md) |
| **Phase 9** | Public Institutional Web Portal | `apps/public` showcase, Home, About, Leadership, Research Explorer, Contact forms | [**Phase 9 Plan**](phases/phase-09-public-web-portal.md) |
| **Phase 10** | Hardening, Testing & Deployment | End-to-end tests, security headers, docker production build, documentation | [**Phase 10 Plan**](phases/phase-10-hardening-and-deployment.md) |
