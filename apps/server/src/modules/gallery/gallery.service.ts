/**
 * @file apps/server/src/modules/gallery/gallery.service.ts
 * @description Service layer for gallery media CRUD operations.
 * Handles categorized photo gallery management.
 */

import { desc, eq } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { galleryMedia } from '../../db/schema/index.js';
import type { NewGalleryMedia } from '../../db/schema/index.js';

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
    .where(
      eq(
        galleryMedia.category,
        category as
          | 'FIELD_TRIALS'
          | 'LABORATORY'
          | 'SPICE_VARIETIES'
          | 'COFFEE_RESEARCH'
          | 'COMMUNITY_OUTREACH'
          | 'FACILITIES'
      )
    )
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
export async function createGalleryMedia(data: NewGalleryMedia) {
  const [created] = await db.insert(galleryMedia).values(data).execute();
  return created;
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
