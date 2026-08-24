/**
 * @file apps/server/src/db/schema/users.ts
 * @description Drizzle ORM schema definition for the `users` table.
 * Stores system authentication accounts, hashed passwords, and assigned 4-tier RBAC roles.
 */

import { relations } from 'drizzle-orm';
import { boolean, index, mysqlEnum, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { news } from './communication';
import { contactMessages } from './messages';
import { staff } from './staff';
import { vehicleAssignments } from './vehicles';

/**
 * Users Table
 * Represents an authenticated actor in the TARCMS platform.
 */
export const users = mysqlTable(
  'users',
  {
    /** Primary key: UUID v4 */
    id: varchar('id', { length: 36 }).primaryKey(),

    /** Full display name of the user */
    name: varchar('name', { length: 120 }).notNull(),

    /** Unique institutional or administrative email address */
    email: varchar('email', { length: 191 }).notNull().unique(),

    /** Bcrypt hashed password (minimum 10 salt rounds) */
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),

    /** 4-Tier Role-Based Access Control level */
    role: mysqlEnum('role', ['SUPER_ADMIN', 'ADMIN', 'RESEARCHER', 'STAFF'])
      .notNull()
      .default('STAFF'),

    /** Optional avatar/photo URL */
    avatarUrl: varchar('avatar_url', { length: 500 }),

    /** Optional direct contact telephone number */
    phone: varchar('phone', { length: 50 }),

    /** Flag indicating whether user account is active and permitted to authenticate */
    isActive: boolean('is_active').notNull().default(true),

    /** Audit timestamp of account creation */
    createdAt: timestamp('created_at').notNull().defaultNow(),

    /** Audit timestamp of latest modification */
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  (table) => ({
    emailIdx: index('idx_users_email').on(table.email),
    roleIdx: index('idx_users_role').on(table.role),
  })
);

/**
 * Relations definition for users table.
 * Links users to linked staff profile, authored news, vehicle reservations, and assigned contact inquiries.
 */
export const usersRelations = relations(users, ({ one, many }) => ({
  /** 1-to-1 optional relationship with staff personnel record */
  staffProfile: one(staff, {
    fields: [users.id],
    references: [staff.userId],
  }),

  /** 1-to-many relationship with news articles authored by this user */
  authoredNews: many(news),

  /** 1-to-many relationship with vehicle assignment requests */
  vehicleRequests: many(vehicleAssignments),

  /** 1-to-many relationship with contact messages assigned to this user */
  assignedMessages: many(contactMessages),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
