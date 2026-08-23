# TARCMS Requirements Traceability Matrix

> **Source**: TARCMS Project Concept, Purpose, Importance & Functional Overview Document

---

| Req ID | Requirement Description | Domain / Module | DB Entities | API Endpoints | UI Pages / Components | Tests | Phase |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **REQ-PUB-01** | Public Home Page & Highlights | Public / Home | `system_settings`, `news`, `events`, `research_projects` | `GET /api/v1/public/settings`, `GET /api/v1/public/news` | `HomePage.tsx`, `HeroSection`, `FeaturedNews` | `HomePage.test.tsx` | Phase 9 |
| **REQ-PUB-02** | About & Institutional Identity | Public / About | `system_settings` | `GET /api/v1/public/settings` | `AboutPage.tsx`, `MissionVisionCard` | `AboutPage.test.tsx` | Phase 9 |
| **REQ-PUB-03** | Director's Message & Profile | Public / Leadership | `system_settings`, `staff` | `GET /api/v1/public/settings` | `DirectorPage.tsx`, `LeadershipCard` | `DirectorPage.test.tsx` | Phase 9 |
| **REQ-PUB-04** | Department Catalog & Roster | Departments | `departments`, `staff` | `GET /api/v1/public/departments` | `DepartmentsPage.tsx`, `DepartmentDetail` | `departments.api.test.ts` | Phase 5 |
| **REQ-PUB-05** | Research Programs Directory | Research Programs | `research_programs`, `departments` | `GET /api/v1/public/research-programs` | `ResearchProgramsPage.tsx`, `ProgramCard` | `programs.api.test.ts` | Phase 6 |
| **REQ-PUB-06** | Research Projects Explorer | Research Projects | `research_projects`, `staff` | `GET /api/v1/public/projects` | `ProjectsPage.tsx`, `ProjectFilterBar` | `projects.api.test.ts` | Phase 6 |
| **REQ-PUB-07** | Publications & Scientific Papers | Publications | `publications`, `publication_authors` | `GET /api/v1/public/publications` | `PublicationsPage.tsx`, `PublicationRow` | `publications.api.test.ts` | Phase 6 |
| **REQ-PUB-08** | News Articles & Updates | News | `news`, `users` | `GET /api/v1/public/news` | `NewsPage.tsx`, `NewsDetailPage.tsx` | `news.api.test.ts` | Phase 7 |
| **REQ-PUB-09** | Events & Workshop Calendar | Events | `events` | `GET /api/v1/public/events` | `EventsPage.tsx`, `EventCalendar` | `events.api.test.ts` | Phase 7 |
| **REQ-PUB-10** | Photographic Media Gallery | Gallery | `gallery_media` | `GET /api/v1/public/gallery` | `GalleryPage.tsx`, `LightboxModal` | `gallery.api.test.ts` | Phase 7 |
| **REQ-PUB-11** | Contact Form & Coordinates | Messages | `contact_messages`, `system_settings` | `POST /api/v1/public/contact` | `ContactPage.tsx`, `ContactForm` | `contact.workflow.test.ts` | Phase 8 |
| **REQ-ADM-01** | Executive Metrics Dashboard | Admin / Dashboard | Aggregate DB counts | `GET /api/v1/admin/dashboard/metrics` | `DashboardPage.tsx`, `MetricCard` | `dashboard.api.test.ts` | Phase 4 |
| **REQ-ADM-02** | Staff Personnel Management | Admin / Staff | `staff`, `departments` | `CRUD /api/v1/admin/staff` | `AdminStaffPage.tsx`, `StaffModal` | `staff.crud.test.ts` | Phase 5 |
| **REQ-ADM-03** | Department Management | Admin / Depts | `departments` | `CRUD /api/v1/admin/departments` | `AdminDepartmentsPage.tsx` | `departments.crud.test.ts` | Phase 5 |
| **REQ-ADM-04** | Research Program Management | Admin / Programs | `research_programs` | `CRUD /api/v1/admin/research-programs` | `AdminProgramsPage.tsx` | `programs.crud.test.ts` | Phase 6 |
| **REQ-ADM-05** | Research Project Tracking | Admin / Projects | `research_projects` | `CRUD /api/v1/admin/projects` | `AdminProjectsPage.tsx`, `ProjectModal` | `projects.crud.test.ts` | Phase 6 |
| **REQ-ADM-06** | Publication Cataloging & PDFs | Admin / Pubs | `publications`, `publication_authors` | `CRUD /api/v1/admin/publications` | `AdminPublicationsPage.tsx` | `pubs.workflow.test.ts` | Phase 6 |
| **REQ-ADM-07** | News Publishing & Drafts | Admin / News | `news` | `CRUD /api/v1/admin/news` | `AdminNewsPage.tsx`, `NewsEditor` | `news.crud.test.ts` | Phase 7 |
| **REQ-ADM-08** | Events Scheduling | Admin / Events | `events` | `CRUD /api/v1/admin/events` | `AdminEventsPage.tsx`, `EventModal` | `events.crud.test.ts` | Phase 7 |
| **REQ-ADM-09** | Gallery Asset Management | Admin / Gallery | `gallery_media` | `CRUD /api/v1/admin/gallery` | `AdminGalleryPage.tsx`, `ImageUploader` | `gallery.crud.test.ts` | Phase 7 |
| **REQ-ADM-10** | Vehicle Fleet Logistics | Admin / Vehicles | `vehicles`, `vehicle_assignments` | `CRUD /api/v1/admin/vehicles` | `AdminVehiclesPage.tsx`, `RequisitionModal`| `vehicles.workflow.test.ts` | Phase 8 |
| **REQ-ADM-11** | Contact Inbox & Moderation | Admin / Messages | `contact_messages` | `GET/PATCH /api/v1/admin/messages` | `AdminMessagesPage.tsx`, `ReplyDrawer` | `messages.crud.test.ts` | Phase 8 |
| **REQ-ADM-12** | Institutional Settings | Admin / Settings | `system_settings` | `PUT /api/v1/admin/settings` | `AdminSettingsPage.tsx` | `settings.api.test.ts` | Phase 4 |
| **REQ-ADM-13** | User & Profile Management | Admin / Users | `users` | `CRUD /api/v1/admin/users`, `PUT /api/v1/auth/profile`| `AdminUsersPage.tsx`, `ProfilePage.tsx` | `users.auth.test.ts` | Phase 3 |
