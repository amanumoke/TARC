# ADR-002: Decoupled Frontend and Backend Separation

## Status
Accepted

## Context
TARCMS requires an institutional web portal with high client performance and responsiveness, alongside a dedicated REST API service for management operations, file processing, and data persistence.

## Decision
We separate the presentation and server layers into:
1. **Public Web Portal (`apps/public`)**: React 19 single-page application bundled with Vite, Tailwind CSS, and shadcn UI for public institutional discovery and showcase.
2. **Management Dashboard (`apps/dashboard`)**: React 19 single-page application bundled with Vite, Tailwind CSS, and shadcn UI for authenticated administration, fleet tracking, and research management.
3. **Backend API (`apps/server`)**: Node.js Express application exposing a versioned REST API (`/api/v1`) with Drizzle ORM and MySQL 8.0.

Both client applications communicate with the backend solely through HTTP JSON REST endpoints and multipart form uploads.

## Consequences
### Positive
- Strict separation of concerns; backend can be tested independently of UI components.
- Frontend static assets can be efficiently served and cached via Nginx or CDN.
- Future mobile or external integrations can reuse the exact same API layer without modifications.

### Negative
- Requires CORS management during development.
