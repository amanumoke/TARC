/**
 * @file apps/server/src/modules/research/programs.service.ts
 * @description Service layer for research programs CRUD operations.
 * Handles the hierarchy between departments and research programs.
 */

import { desc, eq } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { researchPrograms } from '../../db/schema/index.js';
import type { NewResearchProgram } from '../../db/schema/index.js';

/**
 * Fetches all research programs ordered by sort order.
 * @returns Array of research programs
 */
export async function getAllPrograms() {
  return db.select().from(researchPrograms).orderBy(researchPrograms.sortOrder);
}

/**
 * Fetches active research programs for the public portal.
 * @returns Array of active research programs
 */
export async function getActivePrograms() {
  return db
    .select()
    .from(researchPrograms)
    .where(eq(researchPrograms.status, 'ACTIVE'))
    .orderBy(researchPrograms.sortOrder);
}

/**
 * Fetches a single research program by ID.
 * @param id - The program UUID
 * @returns The program record or undefined
 */
export async function getProgramById(id: string) {
  const [program] = await db.select().from(researchPrograms).where(eq(researchPrograms.id, id));
  return program;
}

/**
 * Creates a new research program.
 * @param data - The program data to insert
 * @returns The created program record
 */
export async function createProgram(data: NewResearchProgram) {
  const [created] = await db.insert(researchPrograms).values(data).execute();
  return created;
}

/**
 * Updates an existing research program.
 * @param id - The program UUID to update
 * @param data - Partial program data to update
 * @returns The updated program record
 */
export async function updateProgram(id: string, data: Partial<NewResearchProgram>) {
  await db.update(researchPrograms).set(data).where(eq(researchPrograms.id, id));
  return getProgramById(id);
}

/**
 * Deletes a research program by ID.
 * @param id - The program UUID to delete
 * @returns true on success
 */
export async function deleteProgram(id: string): Promise<boolean> {
  await db.delete(researchPrograms).where(eq(researchPrograms.id, id));
  return true;
}
