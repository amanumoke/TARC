# ADR-009: End-to-End Type Safety & Runtime Validation with Zod

## Status
Accepted

## Context
In a full-stack monorepo, data validation must occur both on the client (for immediate interactive UI feedback) and on the server (for security, data integrity, and injection prevention). Maintaining separate validation logic on frontend and backend leads to duplication, schema drift, and security oversights.

## Decision
We adopt **Zod** as the single source of truth for schema definitions and runtime validation across the entire TARCMS ecosystem:
1. **Shared Schema Repository (`packages/shared/src/schemas/`)**: All domain entities, DTOs, mutation inputs, and query parameters are defined as Zod schemas.
2. **Server-Side Enforcement (`apps/server/src/middleware/validate.ts`)**: Express route handlers use `validateBody(Schema)` and `validateQuery(Schema)` to parse and sanitize all incoming payloads prior to executing business logic. Invalid requests automatically return standard 400 Bad Request envelopes with field-level details.
3. **Client-Side Form Validation (`apps/web`)**: Forms utilize `react-hook-form` paired with `@hookform/resolvers/zod`, executing the exact same Zod schemas on the client for instantaneous user feedback.
4. **TypeScript Inference**: TypeScript types (DTOs and Inputs) are inferred directly from Zod schemas via `z.infer<typeof Schema>`, guaranteeing zero drift between validation rules and compile-time types.

## Consequences
### Positive
- **Single Source of Truth**: Update a validation rule once in `packages/shared`, and both the frontend forms and backend APIs immediately reflect the change.
- **Zero Schema Drift**: Compile-time TypeScript types and runtime validation rules are identical.
- **Enhanced Security**: Server automatically strips unexpected properties and strictly checks data types, string lengths, UUID formats, email formats, and number ranges.
- **Standardized Error Reporting**: Consistent field-level error messages returned to API clients.

### Negative
- Client bundle includes Zod runtime parsing library (minimal impact given modern bundlers and Zod's lightweight footprint).
