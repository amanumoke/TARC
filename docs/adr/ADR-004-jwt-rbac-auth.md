# ADR-004: Stateless JWT Authentication with 4-Tier RBAC

## Status
Accepted

## Context
TARCMS requires secure administrative access with distinct privilege tiers: Super Administrators, Center Administrators, Researchers, and Staff members.

## Decision
We implement stateless JSON Web Tokens (JWT) using `jsonwebtoken` and `bcryptjs` for password hashing:
- Access tokens signed with `JWT_SECRET` containing `{ id, email, role }` with a 24-hour expiration.
- Password hashes generated with minimum 10 salt rounds.
- 4-Tier RBAC middleware (`requireRole('SUPER_ADMIN' | 'ADMIN' | 'RESEARCHER' | 'STAFF')`).

## Consequences
### Positive
- Stateless backend scalability (no server-side session stores needed).
- Granular, declaratively protected Express routes.
- Decoupled client-side authorization guards.
