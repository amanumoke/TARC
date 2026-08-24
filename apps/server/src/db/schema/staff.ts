/**
 * @file apps/server/src/db/schema/staff.ts
 * @description Drizzle ORM schema definition for the `staff` directory table.
 * Stores researcher and administrative profiles, areas of expertise, bios, and department affiliations.
 */

import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  int,
  json,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { departments } from './departments';
import { publicationAuthors } from './publications';
import { researchPrograms, researchProjects } from './research';
import { users } from './users';

/**
 * Staff Table
 * Represents an employee, researcher, or technical specialist at TARC.
 */
export const staff = mysqlTable(
  'staff',
  {
    /** Primary key: UUID v4 */
    id: varchar('id', { length: 36 }).primaryKey(),

    /** Optional 1-to-1 foreign key to users account for login credentials */
    userId: varchar('user_id', { length: 36 }).unique(),

    /** Mandatory foreign key to departments table */
    departmentId: varchar('department_id', { length: 36 })
      .notNull()
      .references(() => departments.id, { onDelete: 'restrict', onUpdate: 'cascade' }),

    /** Given first name */
    firstName: varchar('first_name', { length: 80 }).notNull(),

    /** Family last name */
    lastName: varchar('last_name', { length: 80 }).notNull(),

    /** Official position/title (e.g. "Senior Spice Agronomist", "Director", "Lead Pathologist") */
    position: varchar('position', { length: 120 }).notNull(),

    /** Professional contact email */
    email: varchar('email', { length: 191 }).notNull(),

    /** Optional phone number */
    phone: varchar('phone', { length: 50 }),

    /** Scientific specialization tags formatted as JSON array e.g. ["Large Cardamom", "Tissue Culture"] */
    areasOfExpertise: json('areas_of_expertise').$type<string[]>(),

    /** Full biographical summary of academic background and career */
    bio: text('bio'),

    /** High-resolution portrait photograph URL */
    photoUrl: varchar('photo_url', { length: 500 }),

    /** Active status determining public directory visibility */
    isActive: boolean('is_active').notNull().default(true),

    /** Featured flag for spotlighting on the public homepage */
    isFeatured: boolean('is_featured').notNull().default(false),

    /** Display sequence order within department roster */
    sortOrder: int('sort_order').notNull().default(0),

    /** Audit timestamp of staff entry creation */
    createdAt: timestamp('created_at').notNull().defaultNow(),

    /** Audit timestamp of latest modification */
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  (table) => ({
    departmentIdx: index('idx_staff_department').on(table.departmentId),
    nameIdx: index('idx_staff_name').on(table.lastName, table.firstName),
  })
);

/**
 * Relations definition for staff table.
 */
export const staffRelations = relations(staff, ({ one, many }) => ({
  /** Associated authentication user account */
  user: one(users, {
    fields: [staff.userId],
    references: [users.id],
  }),

  /** Associated research department */
  department: one(departments, {
    fields: [staff.departmentId],
    references: [departments.id],
  }),

  /** Research programs led by this staff member */
  ledPrograms: many(researchPrograms),

  /** Research projects supervised by this staff member */
  ledProjects: many(researchProjects),

  /** Multi-author publication mappings involving this researcher */
  publicationAuthored: many(publicationAuthors),
}));

export type Staff = typeof staff.$inferSelect;
export type NewStaff = typeof staff.$inferInsert;
