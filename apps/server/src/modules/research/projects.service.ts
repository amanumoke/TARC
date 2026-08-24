/**
 * @file apps/server/src/modules/research/projects.service.ts
 * @description Service layer for research projects CRUD operations.
 * Handles projects within research programs with full hierarchy.
 */

import { desc, eq } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { researchProjects } from '../../db/schema/index.js';
import type { NewResearchProject } from '../../db/schema/index.js';

/**
 * Fetches all research projects ordered by creation date.
 * @returns Array of research projects
 */
export async function getAllProjects() {
  return db.select().from(researchProjects).orderBy(desc(researchProjects.createdAt));
}

/**
 * Fetches active research projects for the public portal.
 * @returns Array of ongoing projects
 */
export async function getActiveProjects() {
  return db
    .select()
    .from(researchProjects)
    .where(eq(researchProjects.status, 'ONGOING'))
    .orderBy(desc(researchProjects.createdAt));
}

/**
 * Fetches a single research project by ID.
 * @param id - The project UUID
 * @returns The project record or undefined
 */
export async function getProjectById(id: string) {
  const [project] = await db.select().from(researchProjects).where(eq(researchProjects.id, id));
  return project;
}

/**
 * Creates a new research project.
 * @param data - The project data to insert
 * @returns The created project record
 */
export async function createProject(data: NewResearchProject) {
  const [created] = await db.insert(researchProjects).values(data).execute();
  return created;
}

/**
 * Updates an existing research project.
 * @param id - The project UUID to update
 * @param data - Partial project data to update
 * @returns The updated project record
 */
export async function updateProject(id: string, data: Partial<NewResearchProject>) {
  await db.update(researchProjects).set(data).where(eq(researchProjects.id, id));
  return getProjectById(id);
}

/**
 * Deletes a research project by ID.
 * @param id - The project UUID to delete
 * @returns true on success
 */
export async function deleteProject(id: string): Promise<boolean> {
  await db.delete(researchProjects).where(eq(researchProjects.id, id));
  return true;
}
