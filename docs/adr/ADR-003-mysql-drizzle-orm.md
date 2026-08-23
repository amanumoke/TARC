# ADR-003: MySQL 8.0 with Drizzle ORM

## Status
Accepted

## Context
TARCMS data consists of structured institutional entities with strong relational integrity (Departments, Research Programs, Projects, Publications, Authors, Vehicles). A previous prototype used Supabase (PostgreSQL BaaS), but the system requirements require an on-premise/self-hostable standard MySQL database with type-safe schema definitions and migration tooling.

## Decision
We adopt **MySQL 8.0** as the primary relational database and **Drizzle ORM** (`drizzle-orm/mysql2`) with `drizzle-kit` as the data access and migration framework.

## Consequences
### Positive
- Strict relational constraints and foreign keys directly modeled in TypeScript code.
- Zero-overhead, predictable SQL execution compared to heavy ORMs.
- Straightforward local setup and production containerization using official MySQL Docker images.
- Full type-safety in backend controllers and repositories.

### Negative
- Developers must execute Drizzle Kit migration commands (`npm run db:migrate`) on schema alterations.
