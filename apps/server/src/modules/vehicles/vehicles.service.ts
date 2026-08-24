/**
 * @file apps/server/src/modules/vehicles/vehicles.service.ts
 * @description Service layer for fleet vehicles CRUD operations.
 * Handles vehicle status transitions and assignment lifecycle.
 */

import { desc, eq } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { vehicleAssignments, vehicles } from '../../db/schema/index.js';
import type { NewVehicle, NewVehicleAssignment } from '../../db/schema/index.js';

/**
 * Fetches all vehicles ordered by creation date descending.
 * @returns Array of vehicles
 */
export async function getAllVehicles() {
  return db.select().from(vehicles).orderBy(desc(vehicles.createdAt));
}

/**
 * Fetches available vehicles for assignment.
 * @returns Array of available vehicles
 */
export async function getAvailableVehicles() {
  return db.select().from(vehicles).where(eq(vehicles.status, 'AVAILABLE')).orderBy(vehicles.make);
}

/**
 * Fetches a single vehicle by ID.
 * @param id - The vehicle UUID
 * @returns The vehicle record or undefined
 */
export async function getVehicleById(id: string) {
  const [vehicle] = await db.select().from(vehicles).where(eq(vehicles.id, id));
  return vehicle;
}

/**
 * Creates a new vehicle.
 * @param data - The vehicle data to insert
 * @returns The created vehicle record
 */
export async function createVehicle(data: NewVehicle) {
  const [created] = await db.insert(vehicles).values(data).execute();
  return created;
}

/**
 * Updates a vehicle's status.
 * @param id - The vehicle UUID
 * @param status - The new status
 * @returns The updated vehicle record
 */
export async function updateVehicleStatus(
  id: string,
  status: 'AVAILABLE' | 'IN_USE' | 'UNDER_MAINTENANCE' | 'DECOMMISSIONED'
) {
  await db.update(vehicles).set({ status }).where(eq(vehicles.id, id));
  return getVehicleById(id);
}

/**
 * Deletes a vehicle by ID.
 * @param id - The vehicle UUID to delete
 * @returns true on success
 */
export async function deleteVehicle(id: string): Promise<boolean> {
  await db.delete(vehicles).where(eq(vehicles.id, id));
  return true;
}

/**
 * Fetches all vehicle assignments.
 * @returns Array of vehicle assignments
 */
export async function getAllAssignments() {
  return db.select().from(vehicleAssignments).orderBy(desc(vehicleAssignments.createdAt));
}

/**
 * Creates a new vehicle assignment.
 * @param data - The assignment data to insert
 * @returns The created assignment record
 */
export async function createAssignment(data: NewVehicleAssignment) {
  const [created] = await db.insert(vehicleAssignments).values(data).execute();
  return created;
}

/**
 * Updates an assignment's status.
 * @param id - The assignment UUID
 * @param status - The new status
 * @returns The updated assignment
 */
export async function updateAssignmentStatus(
  id: string,
  status: 'PENDING' | 'APPROVED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
) {
  await db.update(vehicleAssignments).set({ status }).where(eq(vehicleAssignments.id, id));
  const [assignment] = await db
    .select()
    .from(vehicleAssignments)
    .where(eq(vehicleAssignments.id, id));
  return assignment;
}
