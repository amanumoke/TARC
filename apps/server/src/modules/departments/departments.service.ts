/**
 * @file apps/server/src/modules/departments/departments.service.ts
 * @description Service layer for department CRUD operations.
 * Handles database queries for creating, reading, updating, and deleting departments.
 */

import { asc, eq } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { departments } from '../../db/schema/index.js';

/**
 * Represents a department record with optional head information.
 */
export interface DepartmentWithHead {
  id: string;
  name: string;
  code: string;
  description: string | null;
  headId: string | null;
  establishedYear: number | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Fetches all departments ordered by sort order.
 * Used for both public listing and admin management.
 */
export async function getAllDepartments(): Promise<DepartmentWithHead[]> {
  return db.select().from(departments).orderBy(asc(departments.sortOrder));
}

/**
 * Fetches a single department by its unique ID.
 * @param id - The department UUID
 */
export async function getDepartmentById(id: string): Promise<DepartmentWithHead | undefined> {
  const [dept] = await db.select().from(departments).where(eq(departments.id, id));
  return dept;
}

/**
 * Creates a new department record.
 * @param data - Department data excluding auto-generated fields
 */
export async function createDepartment(data: {
  name: string;
  code: string;
  description?: string;
  headId?: string;
  establishedYear?: number;
  sortOrder?: number;
}): Promise<DepartmentWithHead> {
  const id = crypto.randomUUID();
  const [dept] = await db
    .insert(departments)
    .values({ id, ...data })
    .execute();
  return getDepartmentById(id) as Promise<DepartmentWithHead>;
}

/**
 * Updates an existing department by ID.
 * @param id - The department UUID to update
 * @param data - Partial department data to update
 */
export async function updateDepartment(
  id: string,
  data: Partial<{
    name: string;
    code: string;
    description: string;
    headId: string;
    establishedYear: number;
    sortOrder: number;
  }>
): Promise<DepartmentWithHead | undefined> {
  await db.update(departments).set(data).where(eq(departments.id, id));
  return getDepartmentById(id);
}

/**
 * Deletes a department by ID.
 * @param id - The department UUID to delete
 */
export async function deleteDepartment(id: string): Promise<boolean> {
  await db.delete(departments).where(eq(departments.id, id));
  return true;
}
