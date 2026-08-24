CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`name` varchar(120) NOT NULL,
	`email` varchar(191) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`role` enum('SUPER_ADMIN','ADMIN','RESEARCHER','STAFF') NOT NULL DEFAULT 'STAFF',
	`avatar_url` varchar(500),
	`phone` varchar(50),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `departments` (
	`id` varchar(36) NOT NULL,
	`name` varchar(150) NOT NULL,
	`code` varchar(50) NOT NULL,
	`description` text,
	`head_id` varchar(36),
	`established_year` int,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `departments_id` PRIMARY KEY(`id`),
	CONSTRAINT `departments_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `staff` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36),
	`department_id` varchar(36) NOT NULL,
	`first_name` varchar(80) NOT NULL,
	`last_name` varchar(80) NOT NULL,
	`position` varchar(120) NOT NULL,
	`email` varchar(191) NOT NULL,
	`phone` varchar(50),
	`areas_of_expertise` json,
	`bio` text,
	`photo_url` varchar(500),
	`is_active` boolean NOT NULL DEFAULT true,
	`is_featured` boolean NOT NULL DEFAULT false,
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `staff_id` PRIMARY KEY(`id`),
	CONSTRAINT `staff_user_id_unique` UNIQUE(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `research_programs` (
	`id` varchar(36) NOT NULL,
	`department_id` varchar(36) NOT NULL,
	`lead_staff_id` varchar(36),
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`code` varchar(50) NOT NULL,
	`description` text NOT NULL,
	`objectives` json,
	`status` enum('PLANNED','ACTIVE','COMPLETED','SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
	`sort_order` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `research_programs_id` PRIMARY KEY(`id`),
	CONSTRAINT `research_programs_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `research_programs_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `research_projects` (
	`id` varchar(36) NOT NULL,
	`program_id` varchar(36) NOT NULL,
	`department_id` varchar(36) NOT NULL,
	`lead_researcher_id` varchar(36),
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`code` varchar(50) NOT NULL,
	`summary` text NOT NULL,
	`objectives` json,
	`start_date` timestamp,
	`end_date` timestamp,
	`status` enum('PROPOSED','ONGOING','COMPLETED','ON_HOLD') NOT NULL DEFAULT 'ONGOING',
	`funding_source` varchar(150),
	`budget` decimal(15,2),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `research_projects_id` PRIMARY KEY(`id`),
	CONSTRAINT `research_projects_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `research_projects_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `publication_authors` (
	`id` varchar(36) NOT NULL,
	`publication_id` varchar(36) NOT NULL,
	`staff_id` varchar(36),
	`external_author_name` varchar(150),
	`external_affiliation` varchar(200),
	`author_order` int NOT NULL DEFAULT 1,
	`is_corresponding` boolean NOT NULL DEFAULT false,
	CONSTRAINT `publication_authors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `publications` (
	`id` varchar(36) NOT NULL,
	`project_id` varchar(36),
	`title` varchar(300) NOT NULL,
	`slug` varchar(300) NOT NULL,
	`abstract` text NOT NULL,
	`publication_type` enum('JOURNAL_ARTICLE','CONFERENCE_PAPER','TECHNICAL_MANUAL','VARIETY_RELEASE','POLICY_BRIEF') NOT NULL DEFAULT 'JOURNAL_ARTICLE',
	`publisher_or_journal` varchar(200),
	`publication_year` int NOT NULL,
	`doi_url` varchar(300),
	`file_url` varchar(500),
	`file_size_bytes` bigint,
	`peer_reviewed` boolean NOT NULL DEFAULT true,
	`is_featured` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `publications_id` PRIMARY KEY(`id`),
	CONSTRAINT `publications_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`event_type` enum('FIELD_DAY','WORKSHOP','CONFERENCE','TRAINING_SESSION','SEMINAR') NOT NULL DEFAULT 'WORKSHOP',
	`description` text NOT NULL,
	`location` varchar(200) NOT NULL,
	`start_time` timestamp NOT NULL,
	`end_time` timestamp NOT NULL,
	`is_all_day` boolean NOT NULL DEFAULT false,
	`banner_url` varchar(500),
	`is_published` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `events_id` PRIMARY KEY(`id`),
	CONSTRAINT `events_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `gallery_media` (
	`id` varchar(36) NOT NULL,
	`uploaded_by` varchar(36),
	`title` varchar(200) NOT NULL,
	`caption` text,
	`category` enum('FIELD_TRIALS','LABORATORY','SPICE_VARIETIES','COFFEE_RESEARCH','COMMUNITY_OUTREACH','FACILITIES') NOT NULL DEFAULT 'FIELD_TRIALS',
	`image_url` varchar(500) NOT NULL,
	`thumbnail_url` varchar(500),
	`file_size_bytes` int,
	`width` int,
	`height` int,
	`taken_at` date,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `gallery_media_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `news` (
	`id` varchar(36) NOT NULL,
	`author_id` varchar(36),
	`title` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`summary` varchar(500) NOT NULL,
	`content` text NOT NULL,
	`category` enum('RESEARCH_NEWS','INSTITUTIONAL','FARMER_ADVISORY','EVENTS') NOT NULL DEFAULT 'INSTITUTIONAL',
	`cover_image_url` varchar(500),
	`is_published` boolean NOT NULL DEFAULT true,
	`is_featured` boolean NOT NULL DEFAULT false,
	`published_at` timestamp DEFAULT (now()),
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `news_id` PRIMARY KEY(`id`),
	CONSTRAINT `news_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `vehicle_assignments` (
	`id` varchar(36) NOT NULL,
	`vehicle_id` varchar(36) NOT NULL,
	`requested_by_id` varchar(36) NOT NULL,
	`destination` varchar(200) NOT NULL,
	`purpose` text NOT NULL,
	`start_time` timestamp NOT NULL,
	`end_time` timestamp NOT NULL,
	`status` enum('PENDING','APPROVED','ACTIVE','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PENDING',
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vehicle_assignments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` varchar(36) NOT NULL,
	`registration_plate` varchar(50) NOT NULL,
	`make` varchar(80) NOT NULL,
	`model` varchar(80) NOT NULL,
	`year` int NOT NULL,
	`vehicle_type` enum('SUV','PICKUP_4WD','TRUCK','VAN','MOTORCYCLE') NOT NULL DEFAULT 'PICKUP_4WD',
	`department_id` varchar(36),
	`assigned_driver` varchar(120),
	`status` enum('AVAILABLE','IN_USE','UNDER_MAINTENANCE','DECOMMISSIONED') NOT NULL DEFAULT 'AVAILABLE',
	`fuel_type` enum('DIESEL','PETROL') NOT NULL DEFAULT 'DIESEL',
	`mileage_km` int NOT NULL DEFAULT 0,
	`notes` text,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vehicles_id` PRIMARY KEY(`id`),
	CONSTRAINT `vehicles_registration_plate_unique` UNIQUE(`registration_plate`)
);
--> statement-breakpoint
CREATE TABLE `contact_messages` (
	`id` varchar(36) NOT NULL,
	`sender_name` varchar(120) NOT NULL,
	`sender_email` varchar(191) NOT NULL,
	`sender_phone` varchar(50),
	`subject` varchar(200) NOT NULL,
	`message` text NOT NULL,
	`status` enum('UNREAD','READ','IN_PROGRESS','REPLIED','ARCHIVED') NOT NULL DEFAULT 'UNREAD',
	`assigned_to` varchar(36),
	`reply_notes` text,
	`replied_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contact_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `system_settings` (
	`id` varchar(36) NOT NULL DEFAULT 'primary',
	`institution_name` varchar(200) NOT NULL DEFAULT 'Tepi Agricultural Research Center',
	`tagline` varchar(300) NOT NULL DEFAULT 'Pioneering Spice, Coffee & Horticultural Excellence in Southwest Ethiopia',
	`about_text` text,
	`mission_text` text,
	`vision_text` text,
	`director_name` varchar(120),
	`director_title` varchar(120),
	`director_message` text,
	`director_photo_url` varchar(500),
	`official_email` varchar(191) NOT NULL DEFAULT 'info@tarc.gov.et',
	`official_phone` varchar(50) NOT NULL DEFAULT '+251 47 556 0000',
	`physical_address` varchar(255) NOT NULL DEFAULT 'Tepi, Sheka Zone, Southwest Ethiopia',
	`gps_coordinates` varchar(100) DEFAULT '7.1997° N, 35.4244° E',
	`social_links` json,
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `system_settings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `staff` ADD CONSTRAINT `staff_department_id_departments_id_fk` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `research_programs` ADD CONSTRAINT `research_programs_department_id_departments_id_fk` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `research_programs` ADD CONSTRAINT `research_programs_lead_staff_id_staff_id_fk` FOREIGN KEY (`lead_staff_id`) REFERENCES `staff`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `research_projects` ADD CONSTRAINT `research_projects_program_id_research_programs_id_fk` FOREIGN KEY (`program_id`) REFERENCES `research_programs`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `research_projects` ADD CONSTRAINT `research_projects_department_id_departments_id_fk` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `research_projects` ADD CONSTRAINT `research_projects_lead_researcher_id_staff_id_fk` FOREIGN KEY (`lead_researcher_id`) REFERENCES `staff`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `publication_authors` ADD CONSTRAINT `publication_authors_publication_id_publications_id_fk` FOREIGN KEY (`publication_id`) REFERENCES `publications`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `publication_authors` ADD CONSTRAINT `publication_authors_staff_id_staff_id_fk` FOREIGN KEY (`staff_id`) REFERENCES `staff`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `publications` ADD CONSTRAINT `publications_project_id_research_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `research_projects`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `gallery_media` ADD CONSTRAINT `gallery_media_uploaded_by_users_id_fk` FOREIGN KEY (`uploaded_by`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `news` ADD CONSTRAINT `news_author_id_users_id_fk` FOREIGN KEY (`author_id`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `vehicle_assignments` ADD CONSTRAINT `vehicle_assignments_vehicle_id_vehicles_id_fk` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `vehicle_assignments` ADD CONSTRAINT `vehicle_assignments_requested_by_id_users_id_fk` FOREIGN KEY (`requested_by_id`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `vehicles` ADD CONSTRAINT `vehicles_department_id_departments_id_fk` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `contact_messages` ADD CONSTRAINT `contact_messages_assigned_to_users_id_fk` FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX `idx_users_email` ON `users` (`email`);--> statement-breakpoint
CREATE INDEX `idx_users_role` ON `users` (`role`);--> statement-breakpoint
CREATE INDEX `idx_departments_code` ON `departments` (`code`);--> statement-breakpoint
CREATE INDEX `idx_staff_department` ON `staff` (`department_id`);--> statement-breakpoint
CREATE INDEX `idx_staff_name` ON `staff` (`last_name`,`first_name`);--> statement-breakpoint
CREATE INDEX `idx_programs_slug` ON `research_programs` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_programs_department` ON `research_programs` (`department_id`);--> statement-breakpoint
CREATE INDEX `idx_programs_status` ON `research_programs` (`status`);--> statement-breakpoint
CREATE INDEX `idx_projects_slug` ON `research_projects` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_projects_program` ON `research_projects` (`program_id`);--> statement-breakpoint
CREATE INDEX `idx_projects_status` ON `research_projects` (`status`);--> statement-breakpoint
CREATE INDEX `idx_pub_author_pub` ON `publication_authors` (`publication_id`);--> statement-breakpoint
CREATE INDEX `idx_pub_author_staff` ON `publication_authors` (`staff_id`);--> statement-breakpoint
CREATE INDEX `idx_publications_year` ON `publications` (`publication_year`);--> statement-breakpoint
CREATE INDEX `idx_publications_type` ON `publications` (`publication_type`);--> statement-breakpoint
CREATE INDEX `idx_publications_featured` ON `publications` (`is_featured`);--> statement-breakpoint
CREATE INDEX `idx_publications_slug` ON `publications` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_events_start_time` ON `events` (`start_time`);--> statement-breakpoint
CREATE INDEX `idx_events_published` ON `events` (`is_published`);--> statement-breakpoint
CREATE INDEX `idx_events_slug` ON `events` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_gallery_category` ON `gallery_media` (`category`);--> statement-breakpoint
CREATE INDEX `idx_news_published` ON `news` (`is_published`,`published_at`);--> statement-breakpoint
CREATE INDEX `idx_news_category` ON `news` (`category`);--> statement-breakpoint
CREATE INDEX `idx_news_slug` ON `news` (`slug`);--> statement-breakpoint
CREATE INDEX `idx_assignments_vehicle` ON `vehicle_assignments` (`vehicle_id`);--> statement-breakpoint
CREATE INDEX `idx_assignments_dates` ON `vehicle_assignments` (`start_time`,`end_time`);--> statement-breakpoint
CREATE INDEX `idx_vehicles_status` ON `vehicles` (`status`);--> statement-breakpoint
CREATE INDEX `idx_vehicles_plate` ON `vehicles` (`registration_plate`);--> statement-breakpoint
CREATE INDEX `idx_messages_status` ON `contact_messages` (`status`);--> statement-breakpoint
CREATE INDEX `idx_messages_created` ON `contact_messages` (`created_at`);