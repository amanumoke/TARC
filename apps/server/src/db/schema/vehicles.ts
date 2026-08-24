/**
 * @file apps/server/src/db/schema/vehicles.ts
 * @description Drizzle ORM schema definitions for fleet logistics and operational resource management:
 * `vehicles` and `vehicle_assignments` tables.
 */

import { relations } from 'drizzle-orm';
import {
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { departments } from './departments';
import { users } from './users';

/**
 * Vehicles Table
 * Represents institutional motor vehicles in the TARC fleet.
 */
export const vehicles = mysqlTable(
  'vehicles',
  {
    /** Primary key: UUID v4 */
    id: varchar('id', { length: 36 }).primaryKey(),

    /** Official vehicle registration license plate */
    registrationPlate: varchar('registration_plate', { length: 50 }).notNull().unique(),

    /** Vehicle manufacturer (e.g. "Toyota", "Nissan") */
    make: varchar('make', { length: 80 }).notNull(),

    /** Vehicle model name (e.g. "Land Cruiser", "Hilux 4WD") */
    model: varchar('model', { length: 80 }).notNull(),

    /** Model manufacture year (e.g. 2022) */
    year: int('year').notNull(),

    /** Vehicle physical body type */
    vehicleType: mysqlEnum('vehicle_type', ['SUV', 'PICKUP_4WD', 'TRUCK', 'VAN', 'MOTORCYCLE'])
      .notNull()
      .default('PICKUP_4WD'),

    /** Foreign key to department currently allocated this vehicle */
    departmentId: varchar('department_id', { length: 36 }).references(() => departments.id, {
      onDelete: 'set null',
      onUpdate: 'cascade',
    }),

    /** Name of dedicated institutional driver */
    assignedDriver: varchar('assigned_driver', { length: 120 }),

    /** Real-time fleet operational status */
    status: mysqlEnum('status', ['AVAILABLE', 'IN_USE', 'UNDER_MAINTENANCE', 'DECOMMISSIONED'])
      .notNull()
      .default('AVAILABLE'),

    /** Required fuel type */
    fuelType: mysqlEnum('fuel_type', ['DIESEL', 'PETROL']).notNull().default('DIESEL'),

    /** Current odometer mileage in kilometers */
    mileageKm: int('mileage_km').notNull().default(0),

    /** General maintenance and condition remarks */
    notes: text('notes'),

    /** Audit timestamp of entry creation */
    createdAt: timestamp('created_at').notNull().defaultNow(),

    /** Audit timestamp of latest modification */
    updatedAt: timestamp('updated_at').notNull().defaultNow().onUpdateNow(),
  },
  (table) => ({
    statusIdx: index('idx_vehicles_status').on(table.status),
    plateIdx: index('idx_vehicles_plate').on(table.registrationPlate),
  })
);

/**
 * Vehicle Assignments Table
 * Operational log of staff vehicle bookings and field trip authorizations.
 */
export const vehicleAssignments = mysqlTable(
  'vehicle_assignments',
  {
    /** Primary key: UUID v4 */
    id: varchar('id', { length: 36 }).primaryKey(),

    /** Foreign key to vehicle */
    vehicleId: varchar('vehicle_id', { length: 36 })
      .notNull()
      .references(() => vehicles.id, { onDelete: 'cascade', onUpdate: 'cascade' }),

    /** Foreign key to requesting user */
    requestedById: varchar('requested_by_id', { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: 'restrict', onUpdate: 'cascade' }),

    /** Geographic destination (e.g., "Yeki Woreda Trial Site", "Sheka Substation") */
    destination: varchar('destination', { length: 200 }).notNull(),

    /** Explicit purpose of the journey */
    purpose: text('purpose').notNull(),

    /** Start departure timestamp */
    startTime: timestamp('start_time').notNull(),

    /** Anticipated or actual return timestamp */
    endTime: timestamp('end_time').notNull(),

    /** Approval and dispatch status */
    status: mysqlEnum('status', ['PENDING', 'APPROVED', 'ACTIVE', 'COMPLETED', 'CANCELLED'])
      .notNull()
      .default('PENDING'),

    /** Audit timestamp of assignment request */
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => ({
    vehicleIdx: index('idx_assignments_vehicle').on(table.vehicleId),
    datesIdx: index('idx_assignments_dates').on(table.startTime, table.endTime),
  })
);

/**
 * Relations definitions for vehicles and vehicle_assignments.
 */
export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  department: one(departments, {
    fields: [vehicles.departmentId],
    references: [departments.id],
  }),
  assignments: many(vehicleAssignments),
}));

export const vehicleAssignmentsRelations = relations(vehicleAssignments, ({ one }) => ({
  vehicle: one(vehicles, {
    fields: [vehicleAssignments.vehicleId],
    references: [vehicles.id],
  }),
  requestedBy: one(users, {
    fields: [vehicleAssignments.requestedById],
    references: [users.id],
  }),
}));

export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;
export type VehicleAssignment = typeof vehicleAssignments.$inferSelect;
export type NewVehicleAssignment = typeof vehicleAssignments.$inferInsert;
