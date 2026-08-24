/**
 * @file apps/server/src/modules/messages/messages.service.ts
 * @description Service layer for contact messages CRUD operations.
 * Handles message lifecycle status and moderation workflow.
 */

import { desc, eq } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { contactMessages } from '../../db/schema/index.js';
import type { NewContactMessage } from '../../db/schema/index.js';

/**
 * Fetches all contact messages ordered by creation date descending.
 * @returns Array of contact messages
 */
export async function getAllMessages() {
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

/**
 * Fetches unread messages for the admin inbox.
 * @returns Array of unread messages
 */
export async function getUnreadMessages() {
  return db
    .select()
    .from(contactMessages)
    .where(eq(contactMessages.status, 'UNREAD'))
    .orderBy(desc(contactMessages.createdAt));
}

/**
 * Fetches a single message by ID.
 * @param id - The message UUID
 * @returns The message record or undefined
 */
export async function getMessageById(id: string) {
  const [message] = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
  return message;
}

/**
 * Creates a new contact message from public submission.
 * @param data - The message data to insert
 * @returns The created message record
 */
export async function createMessage(data: NewContactMessage) {
  const [created] = await db.insert(contactMessages).values(data).execute();
  return created;
}

/**
 * Updates a message's status and optional reply notes.
 * @param id - The message UUID
 * @param data - Partial message data to update
 * @returns The updated message record
 */
export async function updateMessage(
  id: string,
  data: Partial<Pick<NewContactMessage, 'status' | 'replyNotes' | 'assignedTo'>>
) {
  await db.update(contactMessages).set(data).where(eq(contactMessages.id, id));
  return getMessageById(id);
}

/**
 * Deletes a message by ID.
 * @param id - The message UUID to delete
 * @returns true on success
 */
export async function deleteMessage(id: string): Promise<boolean> {
  await db.delete(contactMessages).where(eq(contactMessages.id, id));
  return true;
}
