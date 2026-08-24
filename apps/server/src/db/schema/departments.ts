/**
 * @file apps/server/src/db/schema/departments.ts
 * @description Drizzle ORM schema definition for the `departments` table.
 * Represents scientific divisions and operational departments of TARC
 * (e.g. Spices & Essential Oils, Coffee & Beverage Crops, Crop Protection).
 */

import { relations } from 'drizzle-orm';
import { index, int, mysqlTable, text, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { researchPrograms, researchProjects } from './research';
import { staff } from './staff';
import { vehicles } from './vehicles';

/**
 * Departments Table
 * Represents an organizational department at TARC.
 */
export const departments = mysqlTable(
  'departments',
  {
    /** Primary key: UUID v4 */
    id: varchar('id', { length: 36 }).primaryKey(),

    /** Full department title (e.g. "Spices & Essential Oils Research Department") */
    name: varchar('name', { length: 150 }).notNull(),

    /** Unique short identifier code (e.g. "DEPT-SPICE", "DEPT-COFFEE") */
    code: varchar('code', { length: 50 }).notNull().unique(),

    /** Comprehensive description of department mandate and research scope */
    description: text('description'),

    /** Foreign key to staff table: the current head/coordinator of the department */
    headId: varchar('head_id', { length: 36 }),

    /** Historical year the department was formally established */
    establishedYear: int('established_year'),

    /** Display sequence order in UI listings */
    sortOrder: int('sort_order').notNull().default(0),

    /** Audit timestamp of department creation */
    createdAt: timestamp('created_at').notNull().defaultNow(),

    /** Audit timestamp of latest modification */
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  (table) => ({
    codeIdx: index('idx_departments_code').on(table.code),
  })
);

/**
 * Relations definition for departments table.
 */
export const departmentsRelations = relations(departments, ({ one, many }) => ({
  /** Department Head staff member */
  head: one(staff, {
    fields: [departments.headId],
    references: [staff.id],
  }),

  /** Staff members assigned to this department */
  staffMembers: many(staff),

  /** Strategic research programs hosted within this department */
  programs: many(researchPrograms),

  /** Research trials and projects executed within this department */
  projects: many(researchProjects),

  /** Center fleet vehicles assigned to this department */
  assignedVehicles: many(vehicles),
}));

export type Department = typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;
