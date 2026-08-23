# TARCMS Project Requirements Specification

> **Document Status**: Draft Technical Specification  
> **Source Document**: *Tepi Agricultural Research Center Management System (TARCMS) - Project Concept, Purpose, Importance & Functional Overview*  
> **Target Audience**: TARC Leadership, Technical Reviewers, Software Engineering Team

---

## 1. Executive Summary & System Scope

**TARCMS** (Tepi Agricultural Research Center Management System) is a dual-purpose digital platform:
1. **Public Information Portal**: Provides researchers, students, farmers, partners, and the public with verified institutional knowledge, research programs, projects, publications, news, events, and contact channels.
2. **Authorized Management Portal**: Provides center leadership, researchers, and administrative personnel with a secure workspace to manage content, research records, publications, public inquiries, and operational resources (e.g., vehicle tracking).

---

## 2. Requirement Certainty Classification

To maintain integrity with institutional stakeholders, all requirements are explicitly classified into three certainty categories:

| Level | Tag | Definition |
| :--- | :--- | :--- |
| **Confirmed** | `[CONFIRMED]` | Directly stated in the TARCMS Concept Document. |
| **Technical Inference** | `[INFERRED]` | Standard industry architectural requirement to fulfill confirmed features. |
| **Center Decision Needed** | `[REQUIRES-CONFIRMATION]` | Specific institutional data, policy, workflow, or boundary requiring formal sign-off. |

---

## 3. User Roles and Actors

| Actor | Access Scope | Role Description |
| :--- | :--- | :--- |
| **Public Visitor** `[CONFIRMED]` | Public Portal | General public, farmers, students, external researchers, and institutional partners exploring public information. |
| **Super Administrator** `[INFERRED]` | Management Portal | Full administrative authority over system settings, user accounts, role assignments, and audit logs. |
| **Center Administrator** `[CONFIRMED]` | Management Portal | Authorized personnel maintaining institutional news, events, departments, staff records, gallery, and vehicle operational logs. |
| **Researcher** `[CONFIRMED]` | Management Portal | Center scientists managing their assigned research programs, research projects, publications, and professional profiles. |
| **Staff Member** `[CONFIRMED]` | Management Portal | Internal staff viewing institutional announcements, directory, and submitting operational inquiries. |

---

## 4. Functional Requirements

### 4.1 Public Institutional Portal

- **REQ-PUB-01 (Home Page)** `[CONFIRMED]`: Introduce the Center, mission summary, highlighted research programs, featured publications, recent news, upcoming events, and quick call-to-actions.
- **REQ-PUB-02 (About & Institutional Identity)** `[CONFIRMED]`: Present institutional background, mission, vision, mandate, core objectives, and historical context.
- **REQ-PUB-03 (Director & Leadership)** `[CONFIRMED]`: Display official director's profile, welcome message, and leadership structure `[REQUIRES-CONFIRMATION: Official leadership profile & portrait]`.
- **REQ-PUB-04 (Department Directory)** `[CONFIRMED]`: List academic and research departments (e.g., Coffee & Spices, Crop Protection, Soil & Water, Agronomy, Agricultural Economics) with descriptions and staff rosters.
- **REQ-PUB-05 (Research Programs)** `[CONFIRMED]`: Showcase established research disciplines, their objectives, focus areas, and linked projects.
- **REQ-PUB-06 (Research Projects Catalog)** `[CONFIRMED]`: Searchable, filterable directory of ongoing, completed, and planned projects with objectives, lead researchers, and timeline.
- **REQ-PUB-07 (Publications Repository)** `[CONFIRMED]`: Searchable index of scientific papers, technical reports, manuals, and conference proceedings with authors, publication year, abstract, DOI link, and downloadable PDF.
- **REQ-PUB-08 (News & Announcements)** `[CONFIRMED]`: Categorized news articles, breakthroughs, field milestones, and official press releases with rich media and date stamps.
- **REQ-PUB-09 (Events Calendar)** `[CONFIRMED]`: Chronological listing of field days, workshops, conferences, training sessions, and seminars with schedule, venue, and participation details.
- **REQ-PUB-10 (Media Gallery)** `[CONFIRMED]`: Curated albums and categorized photos highlighting research labs, field trials, harvesting, community outreach, and center facilities.
- **REQ-PUB-11 (Contact & Public Inquiries)** `[CONFIRMED]`: Display official physical location, GPS/map coordinates, phone, email, postal address, and an interactive message submission form.

### 4.2 Management & Administrative Portal

- **REQ-ADM-01 (Executive Dashboard)** `[CONFIRMED]`: Real-time operational summary displaying counts of active projects, publications, staff members, vehicle statuses, pending contact messages, and recent activity audit trails.
- **REQ-ADM-02 (Staff Management)** `[CONFIRMED]`: Create, update, deactivate, and order staff profiles with name, title, department, email, phone, areas of expertise, bio, and portrait.
- **REQ-ADM-03 (Department Management)** `[CONFIRMED]`: Maintain department names, codes, descriptions, and designated department heads.
- **REQ-ADM-04 (Research Program Management)** `[CONFIRMED]`: CRUD operations for research programs, mapping them to parent departments and lead scientists.
- **REQ-ADM-05 (Research Project Management)** `[CONFIRMED]`: Comprehensive project management tracking title, code, program linkage, principal investigator, co-investigators, dates, funding source, budget, and project milestones.
- **REQ-ADM-06 (Publication Management)** `[CONFIRMED]`: Catalog research outputs with multi-author association, publication type, venue, peer-review status, DOI, and file upload (PDF/DOC).
- **REQ-ADM-07 (News & Editorial Workflow)** `[CONFIRMED]`: Rich-text authoring, draft/published state toggles, featured flags, category assignment, and banner image uploads.
- **REQ-ADM-08 (Event Management)** `[CONFIRMED]`: Scheduling, venue specification, agenda attachment, and post-event archiving.
- **REQ-ADM-09 (Gallery Asset Management)** `[CONFIRMED]`: Multi-image uploads, thumbnail generation, album tagging, and caption editing.
- **REQ-ADM-10 (Vehicle Resource Management)** `[CONFIRMED]`: Internal tracking of center vehicle fleet (plate number, model, vehicle type, department assignment, driver, fuel type, operational status: Available / In-use / Maintenance).
- **REQ-ADM-11 (Contact Message Inbox)** `[CONFIRMED]`: Message moderation lifecycle (Unread -> Read -> Replied -> Archived) with admin internal reply logging and timestamp tracking.
- **REQ-ADM-12 (System & Institutional Settings)** `[CONFIRMED]`: Center-wide configurations (branding, contact details, social links, mission/vision statements, SEO meta tags).
- **REQ-ADM-13 (User & Profile Management)** `[CONFIRMED]`: Self-service profile updates, password change, and superadmin role assignment.

---

## 5. Non-Functional Requirements

- **NFR-01 (Performance)** `[INFERRED]`: Public page load under 1.5 seconds on 3G/4G connections; API response time < 150ms for 95th percentile requests.
- **NFR-02 (Security)** `[INFERRED]`: Industry-standard password hashing (bcrypt, salt rounds >= 10), signed JWT authentication, strict CORS, SQL injection prevention via Drizzle ORM parameterized queries, and XSS sanitization on all user inputs.
- **NFR-03 (Reliability & Availability)** `[INFERRED]`: Graceful degradation when offline, robust error boundaries, structured error logging, and atomic database transactions.
- **NFR-04 (Usability & Responsiveness)** `[CONFIRMED]`: Fully responsive across mobile, tablet, laptop, and high-density desktop displays with accessible UI elements (WCAG 2.1 AA compliant).
- **NFR-05 (Maintainability & Modularity)** `[CONFIRMED]`: Deep modular design allowing future modules (e.g. Laboratory, Inventory, Finance) to be integrated cleanly without refactoring core systems.

---

## 6. Project Scope Boundaries

### Explicitly In Scope (Phase 1):
- Dual public and management web application.
- Public information discovery and contact pipeline.
- Content and research output catalog management.
- Vehicle operational resource tracking.
- Role-based management portal.

### Explicitly Out of Scope (Future Phases Only):
- Financial accounting, payroll, and general ledger `[CONFIRMED: Excluded from Phase 1]`.
- Comprehensive HR management (leave, attendance, payroll) `[CONFIRMED: Excluded from Phase 1]`.
- Laboratory sample tracking and laboratory information management (LIMS) `[CONFIRMED: Excluded from Phase 1]`.
- Procurement and warehouse inventory management `[CONFIRMED: Excluded from Phase 1]`.
- Dedicated mobile native apps (Android/iOS) `[CONFIRMED: Excluded from Phase 1]`.
