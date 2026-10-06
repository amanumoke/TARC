/**
 * @file apps/server/src/modules/gallery/gallery.service.ts
 * @description Service layer for gallery media CRUD operations.
 * Handles categorized photo gallery management.
 */

import { randomUUID } from 'node:crypto';
import { desc, eq } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { galleryMedia } from '../../db/schema/index.js';

const validCategories = [
  'FIELD_TRIALS',
  'LABORATORY',
  'SPICE_VARIETIES',
  'COFFEE_RESEARCH',
  'COMMUNITY_OUTREACH',
  'FACILITIES',
] as const;
type GalleryCategoryType = (typeof validCategories)[number];

function normalizeCategory(cat?: string): GalleryCategoryType {
  if (!cat) return 'FIELD_TRIALS';
  const found = validCategories.find((c) => c === cat.toUpperCase());
  return found || 'FIELD_TRIALS';
}

/**
 * Fetches all gallery media ordered by creation date descending.
 * @returns Array of gallery media
 */
export async function getAllGalleryMedia() {
  return db.select().from(galleryMedia).orderBy(desc(galleryMedia.createdAt));
}

/**
 * Fetches gallery media by category for the public portal.
 * @param category - The category to filter by
 * @returns Array of gallery media in the category
 */
export async function getGalleryByCategory(category: string) {
  return db
    .select()
    .from(galleryMedia)
    .where(eq(galleryMedia.category, normalizeCategory(category)))
    .orderBy(desc(galleryMedia.createdAt));
}

/**
 * Fetches a single gallery media item by ID.
 * @param id - The gallery media UUID
 * @returns The gallery media record or undefined
 */
export async function getGalleryMediaById(id: string) {
  const [media] = await db.select().from(galleryMedia).where(eq(galleryMedia.id, id));
  return media;
}

/**
 * Creates a new gallery media item.
 * @param data - The gallery media data to insert
 * @returns The created gallery media record
 */
export async function createGalleryMedia(data: {
  id?: string;
  uploadedBy?: string | null;
  title: string;
  caption?: string | null;
  category?: string;
  imageUrl?: string;
  mediaUrl?: string;
  thumbnailUrl?: string | null;
  fileSizeBytes?: number | null;
  width?: number | null;
  height?: number | null;
  takenAt?: string | Date | null;
}) {
  const id = data.id || randomUUID();
  const imageUrl = data.imageUrl || data.mediaUrl || '';
  const takenAt = data.takenAt ? new Date(data.takenAt) : null;

  await db
    .insert(galleryMedia)
    .values({
      id,
      uploadedBy: data.uploadedBy || null,
      title: data.title?.trim() || 'Gallery Media',
      caption: data.caption?.trim() || null,
      category: normalizeCategory(data.category),
      imageUrl,
      thumbnailUrl: data.thumbnailUrl || null,
      fileSizeBytes: data.fileSizeBytes || null,
      width: data.width || null,
      height: data.height || null,
      takenAt,
    })
    .execute();

  return getGalleryMediaById(id);
}

export async function updateGalleryMedia(
  id: string,
  data: Partial<{
    title?: string;
    caption?: string | null;
    category?: string;
    imageUrl?: string;
    mediaUrl?: string;
    thumbnailUrl?: string | null;
    takenAt?: string | Date | null;
  }>
) {
  const updatePayload: Record<string, unknown> = {};

  if (data.title !== undefined) updatePayload.title = data.title.trim();
  if (data.caption !== undefined) updatePayload.caption = data.caption?.trim() || null;
  if (data.category !== undefined) updatePayload.category = normalizeCategory(data.category);
  if (data.imageUrl !== undefined || data.mediaUrl !== undefined) {
    updatePayload.imageUrl = data.imageUrl || data.mediaUrl || '';
  }
  if (data.thumbnailUrl !== undefined) updatePayload.thumbnailUrl = data.thumbnailUrl;
  if (data.takenAt !== undefined) updatePayload.takenAt = data.takenAt ? new Date(data.takenAt) : null;

  if (Object.keys(updatePayload).length > 0) {
    await db.update(galleryMedia).set(updatePayload).where(eq(galleryMedia.id, id));
  }

  return getGalleryMediaById(id);
}

/**
 * Deletes a gallery media item by ID.
 * @param id - The gallery media UUID to delete
 * @returns true on success
 */
export async function deleteGalleryMedia(id: string): Promise<boolean> {
  await db.delete(galleryMedia).where(eq(galleryMedia.id, id));
  return true;
}
