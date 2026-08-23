# TARCMS Domain & System Design

> **Document Status**: Detailed Domain & Module Design  
> **Source Principles**: Deep Modules, Clean Seams, Strong Invariant Encapsulation

---

## 1. Domain Entities & Module Definitions

### 1.1 Users, Roles & Permissions
- **Purpose**: Manages system authentication, administrative accounts, role assignments, and profile metadata.
- **Roles**:
  - `SUPER_ADMIN`: System-wide master control, user lifecycle, system settings.
  - `ADMIN`: Center operational management, news/events publishing, staff & vehicle directory.
  - `RESEARCHER`: Manages research programs, projects, and publication records.
  - `STAFF`: Views internal records, submits departmental notifications.
- **Invariants**:
  - Every user must possess a unique, valid institutional or personal email.
  - Role cannot be escalated by a user with lesser or equal privileges.
  - Deactivating a user preserves historical audit attribution (authored articles, led projects).

### 1.2 Departments
- **Purpose**: Represents institutional units within TARC (e.g., *Coffee & Beverage Crops*, *Spices & Essential Oils*, *Horticultural Crops*, *Crop Protection*, *Natural Resources & Soil Science*, *Agricultural Economics & Extension*).
- **Attributes**: `id`, `name`, `code` (e.g., `DEPT-SPICE`), `description`, `head_id` (foreign key to Staff), `established_year`, `created_at`, `updated_at`.
- **Relationships**:
  - 1 Department -> Many Staff members.
  - 1 Department -> Many Research Programs.
  - 1 Department -> Many Research Projects.

### 1.3 Staff Directory
- **Purpose**: Represents researchers, agronomists, technical assistants, and administrative leaders at the Center.
- **Attributes**: `id`, `user_id` (optional 1:1 link for login credentials), `department_id`, `first_name`, `last_name`, `position` (e.g., *Senior Researcher in Spices*, *Lead Pathologist*), `email`, `phone`, `areas_of_expertise` (JSON array), `bio`, `photo_url`, `is_active`, `sort_order`, `created_at`.
- **Invariants**:
  - Only approved staff members are published to the public directory.
  - Sensitive personal data (salary, private phone if restricted) is isolated from public endpoints.

### 1.4 Research Programs
- **Purpose**: High-level scientific disciplines and long-term strategic research initiatives at TARC.
- **Attributes**: `id`, `department_id`, `lead_staff_id`, `title`, `slug`, `code` (e.g., `PROG-CARDAMOM-BREEDING`), `description`, `objectives` (JSON array of strings), `status` (`PLANNED`, `ACTIVE`, `COMPLETED`, `SUSPENDED`), `created_at`.
- **Relationships**:
  - Belongs to 1 Department.
  - Led by 1 Staff Lead.
  - Has many Research Projects.

### 1.5 Research Projects
- **Purpose**: Specific, time-bound scientific research trials, breeding experiments, or extension studies.
- **Attributes**: `id`, `program_id`, `department_id`, `lead_researcher_id`, `title`, `slug`, `code` (e.g., `PRJ-COR-2026-01`), `summary`, `objectives` (JSON array), `start_date`, `end_date`, `status` (`PROPOSED`, `ONGOING`, `COMPLETED`, `ON_HOLD`), `funding_source`, `budget`, `created_at`.
- **Relationships**:
  - Belongs to 1 Research Program.
  - Supervised by 1 Lead Researcher.
  - Linked to Many Co-Researchers via `project_researchers` join table.
  - Associated with Many Publications.

### 1.6 Publications & Authors
- **Purpose**: Scientific outputs produced by TARC researchers (journal articles, conference papers, technical bulletins, production manuals, variety release notices).
- **Attributes**: `id`, `project_id` (optional foreign key), `title`, `slug`, `abstract`, `publication_type` (`JOURNAL_ARTICLE`, `CONFERENCE_PAPER`, `TECHNICAL_MANUAL`, `VARIETY_RELEASE`, `POLICY_BRIEF`), `publisher_or_journal`, `publication_year`, `doi_url`, `file_url`, `file_size_bytes`, `peer_reviewed` (boolean), `is_featured`, `created_at`.
- **Author Relationship**: Many-to-Many via `publication_authors` junction table:
  - Links to internal `staff_id` when the author is a center researcher.
  - Stores `external_author_name` and `external_affiliation` when co-authored with external universities or international institutions (e.g., EIAR, FAO, Jimma University).
  - Explicit `author_order` (1st author, 2nd author, corresponding author).

### 1.7 News & Editorial
- **Purpose**: Institutional press releases, harvest reports, research breakthroughs, and public announcements.
- **Attributes**: `id`, `author_id`, `title`, `slug`, `summary`, `content` (Markdown / HTML), `category` (`RESEARCH_NEWS`, `INSTITUTIONAL`, `FARMER_ADVISORY`, `EVENTS`), `cover_image_url`, `published_at`, `is_published`, `is_featured`, `created_at`.

### 1.8 Events Calendar
- **Purpose**: Scientific conferences, farmer training field days, workshops, seed distribution dates, and seminars.
- **Attributes**: `id`, `title`, `slug`, `event_type` (`FIELD_DAY`, `WORKSHOP`, `CONFERENCE`, `TRAINING_SESSION`, `SEMINAR`), `description`, `location`, `start_time`, `end_time`, `is_all_day`, `banner_url`, `is_published`, `created_at`.

### 1.9 Gallery & Media Management
- **Purpose**: High-resolution photographic record of TARC field trials, laboratory equipment, nursery stations, and extension visits.
- **Attributes**: `id`, `uploaded_by`, `title`, `caption`, `category` (`FIELD_TRIALS`, `LABORATORY`, `SPICE_VARIETIES`, `COFFEE_RESEARCH`, `COMMUNITY_OUTREACH`, `FACILITIES`), `image_url`, `thumbnail_url`, `width`, `height`, `file_size`, `taken_at`, `created_at`.

### 1.10 Vehicles (Operational Resource Management)
- **Purpose**: Centralized tracking and operational logistics of TARC's fleet (field trial transportation, logistics).
- **Attributes**: `id`, `registration_plate`, `make`, `model`, `year`, `vehicle_type` (`SUV`, `PICKUP_4WD`, `TRUCK`, `VAN`, `MOTORCYCLE`), `department_id`, `assigned_driver`, `status` (`AVAILABLE`, `IN_USE`, `UNDER_MAINTENANCE`, `DECOMMISSIONED`), `fuel_type` (`DIESEL`, `PETROL`), `mileage_km`, `notes`, `created_at`.
- **Assignment Log**: `vehicle_assignments` (`id`, `vehicle_id`, `requested_by`, `destination`, `purpose`, `start_time`, `end_time`, `status`).

### 1.11 Contact Messages & Visitor Inquiries
- **Purpose**: Captures and routes messages submitted through the public contact form.
- **Attributes**: `id`, `sender_name`, `sender_email`, `sender_phone`, `subject`, `message`, `status` (`UNREAD`, `READ`, `IN_PROGRESS`, `REPLIED`, `ARCHIVED`), `assigned_to`, `reply_notes`, `replied_at`, `created_at`.

### 1.12 Institutional Settings
- **Purpose**: Center identity, leadership message, vision, mission, and contact information.
- **Attributes**: `id`, `institution_name`, `tagline`, `about_text`, `mission_text`, `vision_text`, `director_name`, `director_title`, `director_message`, `director_photo_url`, `official_email`, `official_phone`, `physical_address`, `gps_coordinates`, `social_links` (JSON), `updated_at`.

---

## 2. Core Domain Relationship Diagram

```
+----------------+          1 : N          +--------------------+
|  Departments   | ----------------------> |  Research Programs |
+----------------+                         +--------------------+
   |          |                                      |
   | 1:N      | 1:N                                  | 1:N
   v          v                                      v
+-------+  +----------+       1 : N         +--------------------+
| Staff |  | Vehicles |                     | Research Projects  |
+-------+  +----------+                     +--------------------+
   ^                                                 |
   |                                                 | 0..1 : N
   |           N : M via publication_authors         v
   +--------------------------------------- +--------------------+
   |                                        |    Publications    |
   +--------------------------------------- +--------------------+
```
