/**
 * @file apps/server/src/db/schema/communication.ts
 * @description Drizzle ORM schema definitions for institutional communication modules:
 * `news`, `events`, and `gallery_media` tables.
 */

import { relations } from 'drizzle-orm';
import {
  boolean,
  date,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { users } from './users';

/**
 * News Table
 * Represents institutional news releases, research updates, and farmer advisories.
 */
export const news = mysqlTable(
  'news',
  {
    /** Primary key: UUID v4 */
    id: varchar('id', { length: 36 }).primaryKey(),

    /** Foreign key to author user account */
    authorId: varchar('author_id', { length: 36 }).references(() => users.id, {
      onDelete: 'set null',
      onUpdate: 'cascade',
    }),

    /** Article headline */
    title: varchar('title', { length: 255 }).notNull(),

    /** URL slug */
    slug: varchar('slug', { length: 255 }).notNull().unique(),

    /** Brief introductory summary for cards and feeds */
    summary: varchar('summary', { length: 500 }).notNull(),

    /** Full editorial article content (Markdown or rich HTML) */
    content: text('content').notNull(),

    /** Article category */
    category: mysqlEnum('category', ['RESEARCH_NEWS', 'INSTITUTIONAL', 'FARMER_ADVISORY', 'EVENTS'])
      .notNull()
      .default('INSTITUTIONAL'),

    /** Header cover banner image URL */
    coverImageUrl: varchar('cover_image_url', { length: 500 }),

    /** Publishing state flag */
    isPublished: boolean('is_published').notNull().default(true),

    /** Featured spotlight flag */
    isFeatured: boolean('is_featured').notNull().default(false),

    /** Published date timestamp */
    publishedAt: timestamp('published_at').defaultNow(),

    /** Audit timestamp of creation */
    createdAt: timestamp('created_at').notNull().defaultNow(),

    /** Audit timestamp of latest modification */
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  (table) => ({
    publishedIdx: index('idx_news_published').on(table.isPublished, table.publishedAt),
    categoryIdx: index('idx_news_category').on(table.category),
    slugIdx: index('idx_news_slug').on(table.slug),
  })
);

/**
 * Events Table
 * Represents scheduled workshops, conferences, farmer field days, and trainings.
 */
export const events = mysqlTable(
  'events',
  {
    /** Primary key: UUID v4 */
    id: varchar('id', { length: 36 }).primaryKey(),

    /** Event title */
    title: varchar('title', { length: 255 }).notNull(),

    /** URL slug */
    slug: varchar('slug', { length: 255 }).notNull().unique(),

    /** Event format classification */
    eventType: mysqlEnum('event_type', [
      'FIELD_DAY',
      'WORKSHOP',
      'CONFERENCE',
      'TRAINING_SESSION',
      'SEMINAR',
    ])
      .notNull()
      .default('WORKSHOP'),

    /** Detailed event agenda and description */
    description: text('description').notNull(),

    /** Physical or virtual venue location */
    location: varchar('location', { length: 200 }).notNull(),

    /** Event start time */
    startTime: timestamp('start_time').notNull(),

    /** Event conclusion time */
    endTime: timestamp('end_time').notNull(),

    /** Full-day event flag */
    isAllDay: boolean('is_all_day').notNull().default(false),

    /** Event banner image URL */
    bannerUrl: varchar('banner_url', { length: 500 }),

    /** Visibility flag */
    isPublished: boolean('is_published').notNull().default(true),

    /** Audit timestamp of event creation */
    createdAt: timestamp('created_at').notNull().defaultNow(),

    /** Audit timestamp of latest modification */
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  (table) => ({
    startIdx: index('idx_events_start_time').on(table.startTime),
    publishedIdx: index('idx_events_published').on(table.isPublished),
    slugIdx: index('idx_events_slug').on(table.slug),
  })
);

/**
 * Gallery Media Table
 * High-resolution field photos, lab snapshots, and research assets.
 */
export const galleryMedia = mysqlTable(
  'gallery_media',
  {
    /** Primary key: UUID v4 */
    id: varchar('id', { length: 36 }).primaryKey(),

    /** User who uploaded the media asset */
    uploadedBy: varchar('uploaded_by', { length: 36 }).references(() => users.id, {
      onDelete: 'set null',
      onUpdate: 'cascade',
    }),

    /** Photo title */
    title: varchar('title', { length: 200 }).notNull(),

    /** Descriptive caption */
    caption: text('caption'),

    /** Categorical album classification */
    category: mysqlEnum('category', [
      'FIELD_TRIALS',
      'LABORATORY',
      'SPICE_VARIETIES',
      'COFFEE_RESEARCH',
      'COMMUNITY_OUTREACH',
      'FACILITIES',
    ])
      .notNull()
      .default('FIELD_TRIALS'),

    /** Full resolution image URL */
    imageUrl: varchar('image_url', { length: 500 }).notNull(),

    /** Optimized thumbnail URL */
    thumbnailUrl: varchar('thumbnail_url', { length: 500 }),

    /** File size in bytes */
    fileSizeBytes: int('file_size_bytes'),

    /** Image dimensions in pixels */
    width: int('width'),
    height: int('height'),

    /** Date photo was captured */
    takenAt: date('taken_at'),

    /** Audit timestamp of creation */
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    categoryIdx: index('idx_gallery_category').on(table.category),
  })
);

/**
 * Relations definitions for news and gallery media.
 */
export const newsRelations = relations(news, ({ one }) => ({
  author: one(users, {
    fields: [news.authorId],
    references: [users.id],
  }),
}));

export const galleryMediaRelations = relations(galleryMedia, ({ one }) => ({
  uploader: one(users, {
    fields: [galleryMedia.uploadedBy],
    references: [users.id],
  }),
}));

export type News = typeof news.$inferSelect;
export type NewNews = typeof news.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type GalleryMedia = typeof galleryMedia.$inferSelect;
export type NewGalleryMedia = typeof galleryMedia.$inferInsert;
