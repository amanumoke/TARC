# TARCMS Database Design Specification

> **Engine**: MySQL 8.0+ / InnoDB  
> **Character Set**: `utf8mb4` / Collation: `utf8mb4_unicode_ci`  
> **ORM / Query Builder**: Drizzle ORM (`drizzle-orm/mysql2`)

---

## 1. Relational Schema Architecture

```
                                +-------------------+
                                |    departments    |
                                +-------------------+
                                         |
                       +-----------------+-----------------+
                       |                                   |
                       v                                   v
             +-------------------+               +-------------------+
             |       staff       |               | research_programs |
             +-------------------+               +-------------------+
                       |                                   |
                       |                                   v
                       |                         +-------------------+
                       |                         | research_projects |
                       |                         +-------------------+
                       |                                   |
                       |                                   v
                       |                         +-------------------+
                       |                         |   publications    |
                       |                         +-------------------+
                       |                                   |
                       +-----------------+-----------------+
                                         |
                                         v
                         +-------------------------------+
                         |      publication_authors      |
                         +-------------------------------+
```

---

## 2. Table Specifications & DDL Definitions

### 2.1 `users`
Stores authenticated users and system administrative credentials.

```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY, -- UUID v4
  name VARCHAR(120) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('SUPER_ADMIN', 'ADMIN', 'RESEARCHER', 'STAFF') NOT NULL DEFAULT 'STAFF',
  avatar_url VARCHAR(500) NULL,
  phone VARCHAR(50) NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 2.2 `departments`
Stores TARC institutional research and operational departments.

```sql
CREATE TABLE departments (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  code VARCHAR(50) NOT NULL UNIQUE,
  description TEXT NULL,
  head_id VARCHAR(36) NULL, -- Foreign key to staff table (added after staff table creation)
  established_year INT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_departments_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 2.3 `staff`
Staff directory and personnel records.

```sql
CREATE TABLE staff (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NULL UNIQUE, -- Optional link to users account
  department_id VARCHAR(36) NOT NULL,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  position VARCHAR(120) NOT NULL,
  email VARCHAR(191) NOT NULL,
  phone VARCHAR(50) NULL,
  areas_of_expertise JSON NULL, -- Array of strings e.g. ["Coffee Pathology", "Soil Fertility"]
  bio TEXT NULL,
  photo_url VARCHAR(500) NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_staff_department FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_staff_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_staff_department (department_id),
  INDEX idx_staff_name (last_name, first_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add deferred foreign key for department head
ALTER TABLE departments
ADD CONSTRAINT fk_department_head FOREIGN KEY (head_id) REFERENCES staff (id) ON DELETE SET NULL ON UPDATE CASCADE;
```

---

### 2.4 `research_programs`
High-level strategic research programs.

```sql
CREATE TABLE research_programs (
  id VARCHAR(36) PRIMARY KEY,
  department_id VARCHAR(36) NOT NULL,
  lead_staff_id VARCHAR(36) NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  code VARCHAR(50) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  objectives JSON NULL, -- Array of objective strings
  status ENUM('PLANNED', 'ACTIVE', 'COMPLETED', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_program_department FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_program_lead FOREIGN KEY (lead_staff_id) REFERENCES staff (id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_programs_slug (slug),
  INDEX idx_programs_department (department_id),
  INDEX idx_programs_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 2.5 `research_projects`
Specific research trials and experimental projects.

```sql
CREATE TABLE research_projects (
  id VARCHAR(36) PRIMARY KEY,
  program_id VARCHAR(36) NOT NULL,
  department_id VARCHAR(36) NOT NULL,
  lead_researcher_id VARCHAR(36) NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  code VARCHAR(50) NOT NULL UNIQUE,
  summary TEXT NOT NULL,
  objectives JSON NULL,
  start_date DATE NULL,
  end_date DATE NULL,
  status ENUM('PROPOSED', 'ONGOING', 'COMPLETED', 'ON_HOLD') NOT NULL DEFAULT 'ONGOING',
  funding_source VARCHAR(150) NULL,
  budget DECIMAL(15, 2) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_project_program FOREIGN KEY (program_id) REFERENCES research_programs (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_project_department FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT fk_project_lead FOREIGN KEY (lead_researcher_id) REFERENCES staff (id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_projects_slug (slug),
  INDEX idx_projects_program (program_id),
  INDEX idx_projects_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 2.6 `publications` & `publication_authors`
Scientific papers, reports, manuals, and author junction mapping.

```sql
CREATE TABLE publications (
  id VARCHAR(36) PRIMARY KEY,
  project_id VARCHAR(36) NULL,
  title VARCHAR(300) NOT NULL,
  slug VARCHAR(300) NOT NULL UNIQUE,
  abstract TEXT NOT NULL,
  publication_type ENUM('JOURNAL_ARTICLE', 'CONFERENCE_PAPER', 'TECHNICAL_MANUAL', 'VARIETY_RELEASE', 'POLICY_BRIEF') NOT NULL DEFAULT 'JOURNAL_ARTICLE',
  publisher_or_journal VARCHAR(200) NULL,
  publication_year INT NOT NULL,
  doi_url VARCHAR(300) NULL,
  file_url VARCHAR(500) NULL, -- Path to uploaded PDF
  file_size_bytes BIGINT NULL,
  peer_reviewed BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_publication_project FOREIGN KEY (project_id) REFERENCES research_projects (id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_publications_year (publication_year),
  INDEX idx_publications_type (publication_type),
  INDEX idx_publications_featured (is_featured),
  FULLTEXT idx_publications_search (title, abstract)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE publication_authors (
  id VARCHAR(36) PRIMARY KEY,
  publication_id VARCHAR(36) NOT NULL,
  staff_id VARCHAR(36) NULL, -- Linked if internal TARC researcher
  external_author_name VARCHAR(150) NULL, -- Specified if external researcher
  external_affiliation VARCHAR(200) NULL,
  author_order INT NOT NULL DEFAULT 1,
  is_corresponding BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT fk_pub_author_pub FOREIGN KEY (publication_id) REFERENCES publications (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_pub_author_staff FOREIGN KEY (staff_id) REFERENCES staff (id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_pub_author_pub (publication_id),
  INDEX idx_pub_author_staff (staff_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 2.7 `news`
Institutional news articles and updates.

```sql
CREATE TABLE news (
  id VARCHAR(36) PRIMARY KEY,
  author_id VARCHAR(36) NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  summary VARCHAR(500) NOT NULL,
  content LONGTEXT NOT NULL,
  category ENUM('RESEARCH_NEWS', 'INSTITUTIONAL', 'FARMER_ADVISORY', 'EVENTS') NOT NULL DEFAULT 'INSTITUTIONAL',
  cover_image_url VARCHAR(500) NULL,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_news_author FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_news_published (is_published, published_at),
  INDEX idx_news_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 2.8 `events`
Workshops, field days, and conferences.

```sql
CREATE TABLE events (
  id VARCHAR(36) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  event_type ENUM('FIELD_DAY', 'WORKSHOP', 'CONFERENCE', 'TRAINING_SESSION', 'SEMINAR') NOT NULL DEFAULT 'WORKSHOP',
  description TEXT NOT NULL,
  location VARCHAR(200) NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  is_all_day BOOLEAN NOT NULL DEFAULT FALSE,
  banner_url VARCHAR(500) NULL,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_events_start_time (start_time),
  INDEX idx_events_published (is_published)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 2.9 `gallery_media`
Photographs, trial field snapshots, and research facility assets.

```sql
CREATE TABLE gallery_media (
  id VARCHAR(36) PRIMARY KEY,
  uploaded_by VARCHAR(36) NULL,
  title VARCHAR(200) NOT NULL,
  caption TEXT NULL,
  category ENUM('FIELD_TRIALS', 'LABORATORY', 'SPICE_VARIETIES', 'COFFEE_RESEARCH', 'COMMUNITY_OUTREACH', 'FACILITIES') NOT NULL DEFAULT 'FIELD_TRIALS',
  image_url VARCHAR(500) NOT NULL,
  thumbnail_url VARCHAR(500) NULL,
  file_size_bytes INT NULL,
  width INT NULL,
  height INT NULL,
  taken_at DATE NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_gallery_user FOREIGN KEY (uploaded_by) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_gallery_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 2.10 `vehicles` & `vehicle_assignments`
Center fleet inventory and assignment logs.

```sql
CREATE TABLE vehicles (
  id VARCHAR(36) PRIMARY KEY,
  registration_plate VARCHAR(50) NOT NULL UNIQUE,
  make VARCHAR(80) NOT NULL,
  model VARCHAR(80) NOT NULL,
  year INT NOT NULL,
  vehicle_type ENUM('SUV', 'PICKUP_4WD', 'TRUCK', 'VAN', 'MOTORCYCLE') NOT NULL DEFAULT 'PICKUP_4WD',
  department_id VARCHAR(36) NULL,
  assigned_driver VARCHAR(120) NULL,
  status ENUM('AVAILABLE', 'IN_USE', 'UNDER_MAINTENANCE', 'DECOMMISSIONED') NOT NULL DEFAULT 'AVAILABLE',
  fuel_type ENUM('DIESEL', 'PETROL') NOT NULL DEFAULT 'DIESEL',
  mileage_km INT NOT NULL DEFAULT 0,
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_vehicle_department FOREIGN KEY (department_id) REFERENCES departments (id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_vehicles_status (status),
  INDEX idx_vehicles_plate (registration_plate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE vehicle_assignments (
  id VARCHAR(36) PRIMARY KEY,
  vehicle_id VARCHAR(36) NOT NULL,
  requested_by_id VARCHAR(36) NOT NULL,
  destination VARCHAR(200) NOT NULL,
  purpose TEXT NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  status ENUM('PENDING', 'APPROVED', 'ACTIVE', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_assignment_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles (id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_assignment_requester FOREIGN KEY (requested_by_id) REFERENCES users (id) ON DELETE RESTRICT ON UPDATE CASCADE,
  INDEX idx_assignments_vehicle (vehicle_id),
  INDEX idx_assignments_dates (start_time, end_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 2.11 `contact_messages`
Public contact submissions and moderation records.

```sql
CREATE TABLE contact_messages (
  id VARCHAR(36) PRIMARY KEY,
  sender_name VARCHAR(120) NOT NULL,
  sender_email VARCHAR(191) NOT NULL,
  sender_phone VARCHAR(50) NULL,
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('UNREAD', 'READ', 'IN_PROGRESS', 'REPLIED', 'ARCHIVED') NOT NULL DEFAULT 'UNREAD',
  assigned_to VARCHAR(36) NULL,
  reply_notes TEXT NULL,
  replied_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_messages_assignee FOREIGN KEY (assigned_to) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX idx_messages_status (status),
  INDEX idx_messages_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### 2.12 `system_settings`
Singleton table storing institutional configuration.

```sql
CREATE TABLE system_settings (
  id VARCHAR(36) PRIMARY KEY DEFAULT 'primary',
  institution_name VARCHAR(200) NOT NULL DEFAULT 'Tepi Agricultural Research Center',
  tagline VARCHAR(300) NOT NULL DEFAULT 'Pioneering Spice, Coffee & Horticultural Excellence in Southwest Ethiopia',
  about_text LONGTEXT NULL,
  mission_text TEXT NULL,
  vision_text TEXT NULL,
  director_name VARCHAR(120) NULL,
  director_title VARCHAR(120) NULL,
  director_message LONGTEXT NULL,
  director_photo_url VARCHAR(500) NULL,
  official_email VARCHAR(191) NOT NULL DEFAULT 'info@tarc.gov.et',
  official_phone VARCHAR(50) NOT NULL DEFAULT '+251 47 556 0000',
  physical_address VARCHAR(255) NOT NULL DEFAULT 'Tepi, Sheka Zone, Southwest Ethiopia',
  gps_coordinates VARCHAR(100) NULL DEFAULT '7.1997° N, 35.4244° E',
  social_links JSON NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

## 3. Indexing & Query Optimization Strategy

1. **Composite Search Indices**: Full-text indexing on `publications (title, abstract)` and `news (title, summary)` for fast instant search.
2. **Slug Lookups**: Unique B-tree indices on all slug columns (`research_programs.slug`, `research_projects.slug`, `publications.slug`, `news.slug`, `events.slug`) guaranteeing sub-millisecond route resolution.
3. **Foreign Key Performance**: Every foreign key is explicitly backed by an index to ensure performant cascading joins.
4. **Visibility Filtering**: Indexed `(is_published, published_at)` composite keys for efficient public feed pagination.
