/**
 * @file apps/server/src/modules/staff/staff.service.ts
 * @description Service layer for staff personnel CRUD operations.
 * Handles database queries for managing researcher and staff profiles.
 */

import { asc, eq } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { staff } from '../../db/schema/index.js';

/**
 * Represents a staff record with department information.
 */
export interface StaffWithDepartment {
  id: string;
  userId: string | null;
  departmentId: string;
  departmentName?: string;
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  phone: string | null;
  areasOfExpertise: string[] | null;
  bio: string | null;
  photoUrl: string | null;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Fetches all active staff members for public directory.
 * Filters to only active staff for public visibility.
 */
export async function getPublicStaff(): Promise<StaffWithDepartment[]> {
  return db.select().from(staff).where(eq(staff.isActive, true)).orderBy(asc(staff.sortOrder));
}

/**
 * Fetches all staff members for admin management.
 * Includes both active and inactive staff.
 */
export async function getAllStaff(): Promise<StaffWithDepartment[]> {
  return db.select().from(staff).orderBy(asc(staff.sortOrder));
}

/**
 * Fetches a single staff member by ID.
 * @param id - The staff member UUID
 */
export async function getStaffById(id: string): Promise<StaffWithDepartment | undefined> {
  const [member] = await db.select().from(staff).where(eq(staff.id, id));
  return member;
}

/**
 * Creates a new staff member record.
 * @param data - Staff data excluding auto-generated fields
 */
export async function createStaff(data: {
  departmentId: string;
  firstName: string;
  lastName: string;
  position: string;
  email: string;
  phone?: string;
  areasOfExpertise?: string[];
  bio?: string;
  photoUrl?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  sortOrder?: number;
}): Promise<StaffWithDepartment> {
  const id = crypto.randomUUID();
  await db
    .insert(staff)
    .values({ id, ...data })
    .execute();
  return getStaffById(id) as Promise<StaffWithDepartment>;
}

/**
 * Updates an existing staff member by ID.
 * @param id - The staff member UUID to update
 * @param data - Partial staff data to update
 */
export async function updateStaff(
  id: string,
  data: Partial<{
    departmentId: string;
    firstName: string;
    lastName: string;
    position: string;
    email: string;
    phone: string;
    areasOfExpertise: string[];
    bio: string;
    photoUrl: string;
    isActive: boolean;
    isFeatured: boolean;
    sortOrder: number;
  }>
): Promise<StaffWithDepartment | undefined> {
  await db.update(staff).set(data).where(eq(staff.id, id));
  return getStaffById(id);
}

/**
 * Deletes a staff member by ID.
 * @param id - The staff member UUID to delete
 */
export async function deleteStaff(id: string): Promise<boolean> {
  await db.delete(staff).where(eq(staff.id, id));
  return true;
}
