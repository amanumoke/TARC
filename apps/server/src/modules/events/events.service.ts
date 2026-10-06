/**
 * @file apps/server/src/modules/events/events.service.ts
 * @description Service layer for events CRUD operations.
 * Handles event scheduling with chronological filtering.
 */

import { randomUUID } from 'node:crypto';
import { and, desc, eq, gte, lte } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { events } from '../../db/schema/index.js';

const validEventTypes = ['FIELD_DAY', 'WORKSHOP', 'CONFERENCE', 'TRAINING_SESSION', 'SEMINAR'] as const;
type EventTypeType = (typeof validEventTypes)[number];

const eventTypeAliases: Record<string, EventTypeType> = {
  FIELD_DAY: 'FIELD_DAY',
  WORKSHOP: 'WORKSHOP',
  CONFERENCE: 'CONFERENCE',
  TRAINING_SESSION: 'TRAINING_SESSION',
  SEMINAR: 'SEMINAR',
  TRAINING: 'TRAINING_SESSION',
  MEETING: 'WORKSHOP',
  OTHER: 'WORKSHOP',
};

function normalizeEventType(type?: string): EventTypeType {
  if (!type) return 'WORKSHOP';
  return eventTypeAliases[type.trim().toUpperCase()] || 'WORKSHOP';
}

function generateEventSlug(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base || `event-${Date.now()}`;
}

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
export async function createEvent(data: {
  id?: string;
  title: string;
  slug?: string;
  eventType?: string;
  description?: string;
  location?: string;
  startTime: string | Date;
  endTime?: string | Date;
  isAllDay?: boolean;
  bannerUrl?: string | null;
  bannerImageUrl?: string | null;
  isPublished?: boolean;
}) {
  const id = data.id || randomUUID();
  let slug = data.slug ? generateEventSlug(data.slug) : generateEventSlug(data.title);

  const existing = await db
    .select({ id: events.id })
    .from(events)
    .where(eq(events.slug, slug));
  if (existing.length > 0) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const startTime = data.startTime ? new Date(data.startTime) : new Date();
  const endTime = data.endTime
    ? new Date(data.endTime)
    : new Date(startTime.getTime() + 2 * 3600 * 1000);

  await db
    .insert(events)
    .values({
      id,
      title: data.title.trim(),
      slug,
      eventType: normalizeEventType(data.eventType),
      description: data.description?.trim() || data.title.trim(),
      location: data.location?.trim() || 'TARC, Tepi',
      startTime,
      endTime,
      isAllDay: Boolean(data.isAllDay),
      bannerUrl: data.bannerUrl || data.bannerImageUrl || null,
      isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
    })
    .execute();

  return getEventById(id);
}

/**
 * Updates an existing event.
 * @param id - The event UUID to update
 * @param data - Partial event data to update
 * @returns The updated event record
 */
export async function updateEvent(
  id: string,
  data: Partial<{
    title?: string;
    slug?: string;
    eventType?: string;
    description?: string;
    location?: string;
    startTime?: string | Date;
    endTime?: string | Date;
    isAllDay?: boolean;
    bannerUrl?: string | null;
    bannerImageUrl?: string | null;
    isPublished?: boolean;
  }>
) {
  const updatePayload: Record<string, unknown> = {};

  if (data.title !== undefined) updatePayload.title = data.title.trim();
  if (data.slug !== undefined) updatePayload.slug = generateEventSlug(data.slug);
  if (data.eventType !== undefined) updatePayload.eventType = normalizeEventType(data.eventType);
  if (data.description !== undefined) updatePayload.description = data.description.trim() || updatePayload.title;
  if (data.location !== undefined) updatePayload.location = data.location.trim() || 'TARC, Tepi';
  if (data.startTime !== undefined) updatePayload.startTime = new Date(data.startTime);
  if (data.endTime !== undefined) updatePayload.endTime = new Date(data.endTime);
  if (data.isAllDay !== undefined) updatePayload.isAllDay = Boolean(data.isAllDay);
  if (data.bannerUrl !== undefined || data.bannerImageUrl !== undefined) {
    updatePayload.bannerUrl = data.bannerUrl || data.bannerImageUrl || null;
  }
  if (data.isPublished !== undefined) updatePayload.isPublished = Boolean(data.isPublished);

  if (Object.keys(updatePayload).length > 0) {
    await db.update(events).set(updatePayload).where(eq(events.id, id));
  }

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
