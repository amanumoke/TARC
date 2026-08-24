/**
 * @file apps/server/src/db/schema/research.ts
 * @description Drizzle ORM schema definitions for `research_programs` and `research_projects` tables.
 * Models scientific programs and specific agricultural trials/experiments conducted at TARC.
 */

import { relations } from 'drizzle-orm';
import {
  decimal,
  index,
  int,
  json,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { departments } from './departments';
import { publications } from './publications';
import { staff } from './staff';

/**
 * Research Programs Table
 * Represents broad strategic research disciplines (e.g., "National Spice Research Program").
 */
export const researchPrograms = mysqlTable(
  'research_programs',
  {
    /** Primary key: UUID v4 */
    id: varchar('id', { length: 36 }).primaryKey(),

    /** Foreign key to host department */
    departmentId: varchar('department_id', { length: 36 })
      .notNull()
      .references(() => departments.id, { onDelete: 'restrict', onUpdate: 'cascade' }),

    /** Optional foreign key to lead researcher/program leader */
    leadStaffId: varchar('lead_staff_id', { length: 36 }).references(() => staff.id, {
      onDelete: 'set null',
      onUpdate: 'cascade',
    }),

    /** Full program title */
    title: varchar('title', { length: 255 }).notNull(),

    /** SEO-friendly unique URL slug (e.g. "spices-and-essential-oils-program") */
    slug: varchar('slug', { length: 255 }).notNull().unique(),

    /** Unique program code (e.g. "PROG-SPICE-01") */
    code: varchar('code', { length: 50 }).notNull().unique(),

    /** Detailed narrative description of the program */
    description: text('description').notNull(),

    /** Strategic scientific objectives formatted as JSON array of strings */
    objectives: json('objectives').$type<string[]>(),

    /** Program lifecycle status */
    status: mysqlEnum('status', ['PLANNED', 'ACTIVE', 'COMPLETED', 'SUSPENDED'])
      .notNull()
      .default('ACTIVE'),

    /** Display sequence order */
    sortOrder: int('sort_order').notNull().default(0),

    /** Audit timestamp of program creation */
    createdAt: timestamp('created_at').notNull().defaultNow(),

    /** Audit timestamp of latest modification */
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  (table) => ({
    slugIdx: index('idx_programs_slug').on(table.slug),
    departmentIdx: index('idx_programs_department').on(table.departmentId),
    statusIdx: index('idx_programs_status').on(table.status),
  })
);

/**
 * Relations definition for research_programs table.
 */
export const researchProgramsRelations = relations(researchPrograms, ({ one, many }) => ({
  /** Department hosting this program */
  department: one(departments, {
    fields: [researchPrograms.departmentId],
    references: [departments.id],
  }),

  /** Lead staff coordinator for the program */
  leadStaff: one(staff, {
    fields: [researchPrograms.leadStaffId],
    references: [staff.id],
  }),

  /** Individual research projects under this program */
  projects: many(researchProjects),
}));

/**
 * Research Projects Table
 * Represents discrete experiments, trials, and research studies.
 */
export const researchProjects = mysqlTable(
  'research_projects',
  {
    /** Primary key: UUID v4 */
    id: varchar('id', { length: 36 }).primaryKey(),

    /** Foreign key to parent research program */
    programId: varchar('program_id', { length: 36 })
      .notNull()
      .references(() => researchPrograms.id, { onDelete: 'restrict', onUpdate: 'cascade' }),

    /** Foreign key to executing department */
    departmentId: varchar('department_id', { length: 36 })
      .notNull()
      .references(() => departments.id, { onDelete: 'restrict', onUpdate: 'cascade' }),

    /** Optional foreign key to primary investigator / lead researcher */
    leadResearcherId: varchar('lead_researcher_id', { length: 36 }).references(() => staff.id, {
      onDelete: 'set null',
      onUpdate: 'cascade',
    }),

    /** Full scientific project title */
    title: varchar('title', { length: 255 }).notNull(),

    /** SEO-friendly unique URL slug */
    slug: varchar('slug', { length: 255 }).notNull().unique(),

    /** Unique project tracking code (e.g. "PRJ-CARD-2026-01") */
    code: varchar('code', { length: 50 }).notNull().unique(),

    /** Executive summary and abstract of the experiment */
    summary: text('summary').notNull(),

    /** Specific trial objectives formatted as JSON array */
    objectives: json('objectives').$type<string[]>(),

    /** Project commencement timestamp */
    startDate: timestamp('start_date'),

    /** Anticipated or actual project completion timestamp */
    endDate: timestamp('end_date'),

    /** Operational progress status */
    status: mysqlEnum('status', ['PROPOSED', 'ONGOING', 'COMPLETED', 'ON_HOLD'])
      .notNull()
      .default('ONGOING'),

    /** Funding partner or institutional sponsor (e.g. "EIAR", "World Bank", "MoA") */
    fundingSource: varchar('funding_source', { length: 150 }),

    /** Allocated budget in ETB */
    budget: decimal('budget', { precision: 15, scale: 2 }),

    /** Audit timestamp of project creation */
    createdAt: timestamp('created_at').notNull().defaultNow(),

    /** Audit timestamp of latest modification */
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  (table) => ({
    slugIdx: index('idx_projects_slug').on(table.slug),
    programIdx: index('idx_projects_program').on(table.programId),
    statusIdx: index('idx_projects_status').on(table.status),
  })
);

/**
 * Relations definition for research_projects table.
 */
export const researchProjectsRelations = relations(researchProjects, ({ one, many }) => ({
  /** Parent strategic program */
  program: one(researchPrograms, {
    fields: [researchProjects.programId],
    references: [researchPrograms.id],
  }),

  /** Host department */
  department: one(departments, {
    fields: [researchProjects.departmentId],
    references: [departments.id],
  }),

  /** Principal Investigator */
  leadResearcher: one(staff, {
    fields: [researchProjects.leadResearcherId],
    references: [staff.id],
  }),

  /** Publications resulting from this project */
  publications: many(publications),
}));

export type ResearchProgram = typeof researchPrograms.$inferSelect;
export type NewResearchProgram = typeof researchPrograms.$inferInsert;
export type ResearchProject = typeof researchProjects.$inferSelect;
export type NewResearchProject = typeof researchProjects.$inferInsert;
