/**
 * @file apps/server/src/modules/events/events.service.ts
 * @description Service layer for events CRUD operations.
 * Handles event scheduling with chronological filtering.
 */

import { and, desc, eq, gte, lte } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { events } from '../../db/schema/index.js';
import type { NewEvent } from '../../db/schema/index.js';

/**
 * Fetches all events ordered by start time descending.
 * @returns Array of events
 */
export async function getAllEvents() {
  return db.select().from(events).orderBy(desc(events.startTime));
}

/**
 * Fetches upcoming events for the public portal.
 * @returns Array of upcoming events
 */
export async function getUpcomingEvents() {
  const now = new Date();
  return db
    .select()
    .from(events)
    .where(and(eq(events.isPublished, true), gte(events.startTime, now)))
    .orderBy(events.startTime);
}

/**
 * Fetches past events for the public portal.
 * @returns Array of past events
 */
export async function getPastEvents() {
  const now = new Date();
  return db
    .select()
    .from(events)
    .where(and(eq(events.isPublished, true), lte(events.endTime, now)))
    .orderBy(desc(events.endTime));
}

/**
 * Fetches a single event by ID.
 * @param id - The event UUID
 * @returns The event record or undefined
 */
export async function getEventById(id: string) {
  const [event] = await db.select().from(events).where(eq(events.id, id));
  return event;
}

/**
 * Creates a new event.
 * @param data - The event data to insert
 * @returns The created event record
 */
export async function createEvent(data: NewEvent) {
  const [created] = await db.insert(events).values(data).execute();
  return created;
}

/**
 * Updates an existing event.
 * @param id - The event UUID to update
 * @param data - Partial event data to update
 * @returns The updated event record
 */
export async function updateEvent(id: string, data: Partial<NewEvent>) {
  await db.update(events).set(data).where(eq(events.id, id));
  return getEventById(id);
}

/**
 * Deletes an event by ID.
 * @param id - The event UUID to delete
 * @returns true on success
 */
export async function deleteEvent(id: string): Promise<boolean> {
  await db.delete(events).where(eq(events.id, id));
  return true;
}
