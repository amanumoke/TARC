# ADR-006: Public vs Internal Data Separation & Endpoint Isolation

## Status
Accepted

## Context
TARC produces both public research publications and internal operational records (such as vehicle logs, unmoderated visitor messages, internal budgets, staff personal contact info).

## Decision
We enforce strict separation at the routing and service layer:
1. **Public Endpoints (`/api/v1/public/*`)**: Filter out draft articles, internal project budgets, unpublished events, vehicle records, visitor message logs, and sensitive personal staff fields.
2. **Admin Endpoints (`/api/v1/admin/*`)**: Require authenticated session and role privileges.
3. Database queries for public consumption explicitly project only approved, sanitized fields.

## Consequences
### Positive
- Prevents accidental exposure of internal operational data or personal staff contacts.
- Conforms directly to the Privacy & Responsible Information Management requirements in the TARCMS Concept document.

