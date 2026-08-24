/**
 * @file apps/server/src/db/schema/settings.ts
 * @description Drizzle ORM schema definition for the `system_settings` table.
 * Stores singleton institutional metadata, leadership profiles, mission/vision texts, and contact details.
 */

import { json, mysqlTable, text, timestamp, varchar } from 'drizzle-orm/mysql-core';

/**
 * System Settings Table
 * Singleton row storing institutional configuration for TARC.
 */
export const systemSettings = mysqlTable('system_settings', {
  /** Primary key: singleton key identifier (defaults to 'primary') */
  id: varchar('id', { length: 36 }).primaryKey().default('primary'),

  /** Formal institutional entity name */
  institutionName: varchar('institution_name', { length: 200 })
    .notNull()
    .default('Tepi Agricultural Research Center'),

  /** Institutional slogan / tagline */
  tagline: varchar('tagline', { length: 300 })
    .notNull()
    .default('Pioneering Spice, Coffee & Horticultural Excellence in Southwest Ethiopia'),

  /** Comprehensive background narrative of the center */
  aboutText: text('about_text'),

  /** Official institutional mission statement */
  missionText: text('mission_text'),

  /** Official institutional vision statement */
  visionText: text('vision_text'),

  /** Full name of the Center Director */
  directorName: varchar('director_name', { length: 120 }),

  /** Director title (e.g. "Center Director & Senior Crop Scientist") */
  directorTitle: varchar('director_title', { length: 120 }),

  /** Formal welcome address and annual message from the Director */
  directorMessage: text('director_message'),

  /** Director portrait image URL */
  directorPhotoUrl: varchar('director_photo_url', { length: 500 }),

  /** Official institutional contact email */
  officialEmail: varchar('official_email', { length: 191 }).notNull().default('info@tarc.gov.et'),

  /** Official center telephone number */
  officialPhone: varchar('official_phone', { length: 50 }).notNull().default('+251 47 556 0000'),

  /** Physical address location */
  physicalAddress: varchar('physical_address', { length: 255 })
    .notNull()
    .default('Tepi, Sheka Zone, Southwest Ethiopia'),

  /** Geographical GPS coordinates string */
  gpsCoordinates: varchar('gps_coordinates', { length: 100 }).default('7.1997° N, 35.4244° E'),

  /** Social media URLs formatted as JSON record */
  socialLinks: json('social_links').$type<Record<string, string>>(),

  /** Audit timestamp of latest modification */
  updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
});

export type SystemSettings = typeof systemSettings.$inferSelect;
export type NewSystemSettings = typeof systemSettings.$inferInsert;
