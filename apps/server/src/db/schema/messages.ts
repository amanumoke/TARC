/**
 * @file apps/server/src/db/schema/messages.ts
 * @description Drizzle ORM schema definition for the `contact_messages` table.
 * Stores visitor contact form submissions, inquiries, and staff moderation/reply records.
 */

import { relations } from 'drizzle-orm';
import { index, mysqlEnum, mysqlTable, text, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { users } from './users';

/**
 * Contact Messages Table
 * Represents an inquiry submitted through the public website.
 */
export const contactMessages = mysqlTable(
  'contact_messages',
  {
    /** Primary key: UUID v4 */
    id: varchar('id', { length: 36 }).primaryKey(),

    /** Submitter's full name */
    senderName: varchar('sender_name', { length: 120 }).notNull(),

    /** Submitter's email address */
    senderEmail: varchar('sender_email', { length: 191 }).notNull(),

    /** Optional telephone contact */
    senderPhone: varchar('sender_phone', { length: 50 }),

    /** Inquiry subject line */
    subject: varchar('subject', { length: 200 }).notNull(),

    /** Message body text */
    message: text('message').notNull(),

    /** Moderation workflow status */
    status: mysqlEnum('status', ['UNREAD', 'READ', 'IN_PROGRESS', 'REPLIED', 'ARCHIVED'])
      .notNull()
      .default('UNREAD'),

    /** User account to whom the inquiry is assigned for follow-up */
    assignedTo: varchar('assigned_to', { length: 36 }).references(() => users.id, {
      onDelete: 'set null',
      onUpdate: 'cascade',
    }),

    /** Internal administrative resolution or reply notes */
    replyNotes: text('reply_notes'),

    /** Timestamp when response was sent to the inquirer */
    repliedAt: timestamp('replied_at'),

    /** Audit timestamp of message receipt */
    createdAt: timestamp('created_at').notNull().defaultNow(),

    /** Audit timestamp of latest modification */
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  (table) => ({
    statusIdx: index('idx_messages_status').on(table.status),
    createdIdx: index('idx_messages_created').on(table.createdAt),
  })
);

/**
 * Relations definition for contact_messages table.
 */
export const contactMessagesRelations = relations(contactMessages, ({ one }) => ({
  assignedUser: one(users, {
    fields: [contactMessages.assignedTo],
    references: [users.id],
  }),
}));

export type ContactMessage = typeof contactMessages.$inferSelect;
export type NewContactMessage = typeof contactMessages.$inferInsert;
