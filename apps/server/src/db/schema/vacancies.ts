import { and, relations } from 'drizzle-orm';
import { boolean, date, index, mysqlEnum, mysqlTable, text, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { departments } from './departments';

export const vacancies = mysqlTable(
  'vacancies',
  {
    id: varchar('id', { length: 36 }).primaryKey(),
    departmentId: varchar('department_id', { length: 36 }).references(() => departments.id, {
      onDelete: 'set null',
      onUpdate: 'cascade',
    }),
    title: varchar('title', { length: 200 }).notNull(),
    employmentType: mysqlEnum('employment_type', [
      'FULL_TIME',
      'CONTRACT',
      'INTERNSHIP',
      'CONSULTANCY',
    ]).notNull().default('FULL_TIME'),
    location: varchar('location', { length: 200 }).notNull(),
    closingDate: date('closing_date').notNull(),
    description: text('description').notNull(),
    qualifications: text('qualifications').notNull(),
    applicationInstructions: text('application_instructions').notNull(),
    isPublished: boolean('is_published').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  (table) => ({
    publishedIdx: index('idx_vacancies_published').on(table.isPublished),
    closingDateIdx: index('idx_vacancies_closing_date').on(table.closingDate),
  })
);

export const vacanciesRelations = relations(vacancies, ({ one }) => ({
  department: one(departments, {
    fields: [vacancies.departmentId],
    references: [departments.id],
  }),
}));

export type Vacancy = typeof vacancies.$inferSelect;
export type NewVacancy = typeof vacancies.$inferInsert;
