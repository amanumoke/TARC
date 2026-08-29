# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Super Admin / Admin / Researcher**: Staff at Tepi Agricultural Research Center (TARC) who manage departments, staff, research programs, publications, news, events, gallery, vehicles, and contact messages.
- **Situation**: Daily operational management of a government agricultural research center in Southwest Ethiopia.
- **Job**: Monitor KPIs, manage content, handle vehicle requisitions, respond to farmer inquiries, and oversee research programs.

## Product Purpose

TARCMS (Tepi Agricultural Research Center Management System) is an internal management dashboard that enables authenticated administrators and researchers to manage all operational aspects of the center — departments, staff, research, publications, communications, and fleet — through a single, role-based interface.

## Positioning

A purpose-built government research center management system for Ethiopian agriculture, combining RBAC-secured operational dashboards with a public-facing research portal. Not a generic CMS — domain-specific for agricultural research workflows.

## Operating Context

- Users authenticate via email/password with JWT tokens
- 4-tier RBAC: SUPER_ADMIN, ADMIN, RESEARCHER, STAFF
- Dashboard runs on localhost:3001 (Vite dev server)
- Server API on localhost:5000 (Express + MySQL)
- Public portal on localhost:3000 (separate Vite app)

## Capabilities and Constraints

- Full CRUD for departments, staff, research programs/projects, publications, news, events, gallery, vehicles, messages
- Dashboard metrics API with real-time KPI cards
- Public portal with hash-based routing for external visitors
- Multer file storage for publication uploads
- MySQL 8.0 database with Drizzle ORM

## Brand Commitments

- Color palette: Deep Forest #1B4332, Canopy #2D6A4F, Fern #52B788, Earth #D4A373, Cream #FEFAE0
- Typography: DM Serif Display + Inter
- Topographic contour design language referencing Sheka highlands

## Evidence on Hand

- Full working codebase with server, dashboard, public apps
- Database seeded with realistic agricultural research data
- Login credentials available for testing

## Product Principles

1. Domain-specific for Ethiopian agricultural research
2. Role-based access with clear permission boundaries
3. Public portal for external visibility, dashboard for internal operations
4. Production-ready with security hardening (Helmet, rate-limiting, CORS)
