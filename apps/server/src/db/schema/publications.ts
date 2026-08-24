/**
 * @file apps/server/src/db/schema/publications.ts
 * @description Drizzle ORM schema definitions for `publications` and `publication_authors` junction table.
 * Models scientific outputs, journal papers, technical bulletins, and multi-author mappings.
 */

import { relations } from 'drizzle-orm';
import {
  bigint,
  boolean,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { researchProjects } from './research';
import { staff } from './staff';

/**
 * Publications Table
 * Represents published scientific literature authored by or affiliated with TARC.
 */
export const publications = mysqlTable(
  'publications',
  {
    /** Primary key: UUID v4 */
    id: varchar('id', { length: 36 }).primaryKey(),

    /** Optional foreign key to associated research project trial */
    projectId: varchar('project_id', { length: 36 }).references(() => researchProjects.id, {
      onDelete: 'set null',
      onUpdate: 'cascade',
    }),

    /** Title of the paper, manual, or release */
    title: varchar('title', { length: 300 }).notNull(),

    /** Unique URL slug */
    slug: varchar('slug', { length: 300 }).notNull().unique(),

    /** Complete abstract or executive summary */
    abstract: text('abstract').notNull(),

    /** Classification type of the publication */
    publicationType: mysqlEnum('publication_type', [
      'JOURNAL_ARTICLE',
      'CONFERENCE_PAPER',
      'TECHNICAL_MANUAL',
      'VARIETY_RELEASE',
      'POLICY_BRIEF',
    ])
      .notNull()
      .default('JOURNAL_ARTICLE'),

    /** Publisher or scientific journal name (e.g., "Ethiopian Journal of Agricultural Sciences") */
    publisherOrJournal: varchar('publisher_or_journal', { length: 200 }),

    /** Year of formal publication (e.g. 2026) */
    publicationYear: int('publication_year').notNull(),

    /** Digital Object Identifier (DOI) or permanent canonical URL */
    doiUrl: varchar('doi_url', { length: 300 }),

    /** Relative or absolute URL path to the uploaded PDF document */
    fileUrl: varchar('file_url', { length: 500 }),

    /** PDF document file size in bytes for download UI indicators */
    fileSizeBytes: bigint('file_size_bytes', { mode: 'number' }),

    /** Indicates whether publication went through formal peer review */
    peerReviewed: boolean('peer_reviewed').notNull().default(true),

    /** Featured flag for spotlighting on the public portal */
    isFeatured: boolean('is_featured').notNull().default(false),

    /** Audit timestamp of publication entry creation */
    createdAt: timestamp('created_at').notNull().defaultNow(),

    /** Audit timestamp of latest modification */
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  (table) => ({
    yearIdx: index('idx_publications_year').on(table.publicationYear),
    typeIdx: index('idx_publications_type').on(table.publicationType),
    featuredIdx: index('idx_publications_featured').on(table.isFeatured),
    slugIdx: index('idx_publications_slug').on(table.slug),
  })
);

/**
 * Publication Authors Junction Table
 * Maps many-to-many relationships between publications and internal staff or external co-authors.
 */
export const publicationAuthors = mysqlTable(
  'publication_authors',
  {
    /** Primary key: UUID v4 */
    id: varchar('id', { length: 36 }).primaryKey(),

    /** Foreign key to parent publication */
    publicationId: varchar('publication_id', { length: 36 })
      .notNull()
      .references(() => publications.id, { onDelete: 'cascade', onUpdate: 'cascade' }),

    /** Foreign key to internal TARC staff researcher (null if external co-author) */
    staffId: varchar('staff_id', { length: 36 }).references(() => staff.id, {
      onDelete: 'set null',
      onUpdate: 'cascade',
    }),

    /** External co-author full name if not in internal TARC staff directory */
    externalAuthorName: varchar('external_author_name', { length: 150 }),

    /** External university, institute, or organizational affiliation */
    externalAffiliation: varchar('external_affiliation', { length: 200 }),

    /** Author sequence order (1 = First Author, 2 = Second Author, etc.) */
    authorOrder: int('author_order').notNull().default(1),

    /** Flag indicating corresponding author status */
    isCorresponding: boolean('is_corresponding').notNull().default(false),
  },
  (table) => ({
    pubIdx: index('idx_pub_author_pub').on(table.publicationId),
    staffIdx: index('idx_pub_author_staff').on(table.staffId),
  })
);

/**
 * Relations definitions for publications and publication_authors tables.
 */
export const publicationsRelations = relations(publications, ({ one, many }) => ({
  /** Associated trial project */
  project: one(researchProjects, {
    fields: [publications.projectId],
    references: [researchProjects.id],
  }),

  /** Multi-author junction mappings */
  authors: many(publicationAuthors),
}));

export const publicationAuthorsRelations = relations(publicationAuthors, ({ one }) => ({
  /** Parent publication record */
  publication: one(publications, {
    fields: [publicationAuthors.publicationId],
    references: [publications.id],
  }),

  /** Internal staff record if applicable */
  staff: one(staff, {
    fields: [publicationAuthors.staffId],
    references: [staff.id],
  }),
}));

export type Publication = typeof publications.$inferSelect;
export type NewPublication = typeof publications.$inferInsert;
export type PublicationAuthor = typeof publicationAuthors.$inferSelect;
export type NewPublicationAuthor = typeof publicationAuthors.$inferInsert;
