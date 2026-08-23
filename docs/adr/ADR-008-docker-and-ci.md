# ADR-008: Multi-Container Docker Orchestration & GitHub Actions CI

## Status
Accepted

## Context
Deploying and developing TARCMS must be reliable across environments (Windows, Linux, MacOS) and verifiable through automated continuous integration before merging code.

## Decision
1. **Containerization**:
   - `docker-compose.yml` orchestrates 3 services: `tarcms-db` (MySQL 8.0), `tarcms-server` (Express API), and `tarcms-web` (Nginx serving built static assets with API reverse proxy).
   - Dedicated multi-stage Dockerfiles for `apps/server` and `apps/web`.
2. **Continuous Integration**:
   - `.github/workflows/ci.yml` runs on every push and pull request to `main`.
   - Pipeline stages: Checkout -> Node.js Setup -> Dependency Install -> Biome Check -> TypeScript Typecheck -> Vitest Tests -> Docker Build Verification.

## Consequences
### Positive
- Reproducible local development and single-command startup (`docker compose up --build`).
- Automated quality gates guaranteeing clean builds and regression prevention on GitHub.
