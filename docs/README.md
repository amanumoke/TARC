# TARCMS Technical Foundation & Architecture Documentation

> Complete technical documentation suite for the **Tepi Agricultural Research Center Management System (TARCMS)** based strictly on the official Project Concept, Purpose, Importance & Functional Overview.

---

## Documentation Navigation Matrix

1. **[Requirements Specification](requirements/requirements-specification.md)**: Functional/non-functional specs with certainty tags (`[CONFIRMED]`, `[INFERRED]`, `[REQUIRES-CONFIRMATION]`), roles, and scope boundaries.
2. **[System Architecture](architecture/system-architecture.md)**: High-level topology, npm workspaces monorepo structure (`apps/web`, `apps/server`, `packages/shared`), layer responsibilities, and deployment architecture.
3. **[System & Domain Design](system-design/system-design.md)**: Deep domain modules, entity models, invariants, and relational structures.
4. **[Database Design & Schema](database/database-design.md)**: MySQL 8.0 DDL, Drizzle ORM mapping, indexes, constraints, audit fields, and junction tables.
5. **[Business Workflows](workflows/workflows.md)**: Research & publication lifecycle, vehicle requisition flow, contact message moderation, and JWT auth flow.
6. **[RESTful API Design](api/api-design.md)**: Standard envelope, response codes, public discovery routes, and role-guarded administrative endpoints.
7. **[Frontend & UI Structure](frontend/ui-structure.md)**: Information architecture, public & admin layouts, navigation, and reusable data components.
8. **Architecture Decision Records (ADRs)**:
   - [ADR-001: Monorepo Architecture with Native npm Workspaces](adr/ADR-001-monorepo-workspaces.md)
   - [ADR-002: Decoupled Frontend and Backend Separation](adr/ADR-002-frontend-backend-separation.md)
   - [ADR-003: MySQL 8.0 with Drizzle ORM](adr/ADR-003-mysql-drizzle-orm.md)
   - [ADR-004: Stateless JWT Authentication with 4-Tier RBAC](adr/ADR-004-jwt-rbac-auth.md)
   - [ADR-005: File & Media Storage Architecture](adr/ADR-005-file-storage-strategy.md)
   - [ADR-006: Public vs Internal Data Separation](adr/ADR-006-public-internal-data-separation.md)
   - [ADR-007: Biome Toolchain & Vitest Test Framework](adr/ADR-007-biome-and-vitest.md)
   - [ADR-008: Multi-Container Docker Orchestration & CI](adr/ADR-008-docker-and-ci.md)
   - [ADR-009: End-to-End Type Safety & Runtime Validation with Zod](adr/ADR-009-zod-runtime-validation.md)
9. **[Security & Privacy Design](security/security-design.md)**: Authentication, RBAC, input validation with Zod, file upload security, and HTTP headers.
10. **[Testing Strategy](testing/testing-strategy.md)**: Unit tests, service integration tests, Supertest API tests, and critical workflow test suites.
11. **[Implementation Roadmap & 10 Phase Plans](implementation/implementation-plan.md)**: 10-Phase execution plan with deliverables, dependencies, and acceptance criteria.
12. **[Requirements Traceability Matrix](traceability/traceability-matrix.md)**: End-to-end mapping from concept requirements to entities, APIs, UI, and phases.
13. **[Decisions & Open Questions for TARC](decisions/tarc-open-questions.md)**: Checklist of institutional data and administrative confirmations needed before final release.
14. **[Production Deployment & Operations Guide](deployment/deployment-plan-and-guide.md)**: Production Docker container setup, reverse proxy Nginx configuration, SSL certificates, backup cron jobs, and rollback procedures.
15. **[Development Workflow & Git Rules](development/development-workflow-and-git-rules.md)**: Dedicated branch per task/feature constraints, mandatory local pre-push CI checklist, conventional commits, and conflict-free rebase lifecycle.
