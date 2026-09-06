CREATE TABLE `vacancies` (
	`id` varchar(36) NOT NULL,
	`department_id` varchar(36),
	`title` varchar(200) NOT NULL,
	`employment_type` enum('FULL_TIME','CONTRACT','INTERNSHIP','CONSULTANCY') NOT NULL DEFAULT 'FULL_TIME',
	`location` varchar(200) NOT NULL,
	`closing_date` date NOT NULL,
	`description` text NOT NULL,
	`qualifications` text NOT NULL,
	`application_instructions` text NOT NULL,
	`is_published` boolean NOT NULL DEFAULT false,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vacancies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `vacancies` ADD CONSTRAINT `vacancies_department_id_departments_id_fk` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX `idx_vacancies_published` ON `vacancies` (`is_published`);--> statement-breakpoint
CREATE INDEX `idx_vacancies_closing_date` ON `vacancies` (`closing_date`);