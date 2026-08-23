# ADR-001: Monorepo Architecture with Native npm Workspaces

## Status
Accepted

## Context
TARCMS comprises a public-facing website, an administrative management portal, a backend API service, and shared domain validation logic and data types. Managing these in disconnected repositories leads to schema drift, duplicate type definitions, and complex deployment coordination.

## Decision
We adopt a monorepo architecture using native **npm workspaces**:
- `apps/public`: Public institutional web portal & portfolio (React 19, Vite, shadcn UI).
- `apps/dashboard`: Authenticated administrative & researcher management portal (React 19, Vite, shadcn UI).
- `apps/server`: Express.js backend API and database migration services (Node.js, Drizzle ORM, MySQL).
- `packages/shared`: Shared TypeScript types, Zod schemas, and API contracts.

We explicitly avoid complex heavy orchestrators (such as Turborepo or Nx) to maintain zero external global tooling dependencies and ensure compatibility with standard Node.js development environments.

## Consequences
### Positive
- Single source of truth for domain types and validation schemas in `@tarcms/shared`.
- Simplified CI/CD pipeline and single-command local development setup (`npm run dev`).
- atomic cross-layer refactoring across client and server.

### Negative
- Monorepo root `package.json` must coordinate cross-workspace scripts.
