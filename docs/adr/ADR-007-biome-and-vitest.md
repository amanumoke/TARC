# ADR-007: Biome Toolchain & Vitest Test Framework

## Status
Accepted

## Context
Code quality, linting, formatting, and automated testing across the monorepo must be fast, unified, and easy to maintain without maintaining complex legacy ESLint and Prettier plugins.

## Decision
1. **Linting & Formatting**: Replace ESLint + Prettier with **Biome** (`@biomejs/biome`) configured at the monorepo root via `biome.json`.
2. **Testing**: Adopt **Vitest** for unit and integration testing across `packages/shared`, `apps/server`, and `apps/web`.

## Consequences
### Positive
- Sub-second linting and formatting across all workspaces.
- Seamless TypeScript and JSX support out of the box.
- Vitest provides Vite-native test execution, fast HMR, and compatibility with Jest assertion APIs.
