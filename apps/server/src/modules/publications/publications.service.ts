/**
 * @file apps/server/src/modules/publications/publications.service.ts
 * @description Service layer for publications with multi-author support.
 * Handles transactional creation of publications with internal and external authors.
 */

import { desc, eq } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { publicationAuthors, publications } from '../../db/schema/index.js';
import type { NewPublication, NewPublicationAuthor } from '../../db/schema/index.js';

/**
 * Fetches all publications ordered by year descending.
 * @returns Array of publications
 */
export async function getAllPublications() {
  return db.select().from(publications).orderBy(desc(publications.publicationYear));
}

/**
 * Fetches featured publications for the public portal.
 * @returns Array of featured publications
 */
export async function getFeaturedPublications() {
  return db
    .select()
    .from(publications)
    .where(eq(publications.isFeatured, true))
    .orderBy(desc(publications.publicationYear));
}

/**
 * Fetches a single publication by ID with its authors.
 * @param id - The publication UUID
 * @returns The publication record with authors or undefined
 */
export async function getPublicationById(id: string) {
  const [pub] = await db.select().from(publications).where(eq(publications.id, id));

  if (!pub) return undefined;

  const authors = await db
    .select()
    .from(publicationAuthors)
    .where(eq(publicationAuthors.publicationId, id))
    .orderBy(publicationAuthors.authorOrder);

  return { ...pub, authors };
}

import { randomUUID } from 'node:crypto';

/**
 * Creates a new publication with authors in a single operation.
 * @param data - Publication data with authors array
 * @returns The created publication with authors
 */
export async function createPublicationWithAuthors(
  data: any
) {
  const pubId = data.id || randomUUID();
  const { authors, ...pubData } = data;

  await db.insert(publications).values({ id: pubId, ...pubData }).execute();

  // Insert all authors with the publication ID
  if (authors && authors.length > 0) {
    const authorsWithPubId = authors.map((author: any, index: number) => ({
      ...author,
      id: author.id || randomUUID(),
      publicationId: pubId,
      authorOrder: author.authorOrder ?? index + 1,
    }));
    await db.insert(publicationAuthors).values(authorsWithPubId).execute();
  }

  return getPublicationById(pubId);
}

/**
 * Deletes a publication and its authors by ID.
 * @param id - The publication UUID to delete
 * @returns true on success
 */
export async function deletePublication(id: string): Promise<boolean> {
  await db.delete(publications).where(eq(publications.id, id));
  return true;
}
