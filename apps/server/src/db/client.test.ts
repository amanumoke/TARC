/**
 * @file apps/server/src/db/client.test.ts
 * @description Unit tests verifying Drizzle ORM database client instantiation,
 * connection pool configuration parameters, and schema bindings.
 */

import { describe, expect, it } from 'vitest';
import { databaseConfig } from '../config/database';
import { db, poolConnection } from './client';
import * as schema from './schema/index';

describe('Database Client & Connection Configuration', () => {
  it('instantiates Drizzle ORM database client with query and transaction capabilities', () => {
    expect(db).toBeDefined();
    expect(typeof db.select).toBe('function');
    expect(typeof db.insert).toBe('function');
    expect(typeof db.update).toBe('function');
    expect(typeof db.delete).toBe('function');
    expect(typeof db.transaction).toBe('function');
    expect(db.query).toBeDefined();
  });

  it('configures MySQL connection pool with robust concurrency options', () => {
    expect(poolConnection).toBeDefined();
    expect(databaseConfig.url).toBeDefined();
    expect(databaseConfig.url).toContain('mysql://');
    expect(typeof databaseConfig.connectionLimit).toBe('number');
    expect(databaseConfig.connectionLimit).toBeGreaterThan(0);
    expect(databaseConfig.waitForConnections).toBe(true);
    expect(databaseConfig.queueLimit).toBe(0);
  });

  it('binds all relational domain entities in the Drizzle schema', () => {
    expect(db.query.users).toBeDefined();
    expect(db.query.departments).toBeDefined();
    expect(db.query.staff).toBeDefined();
    expect(db.query.researchPrograms).toBeDefined();
    expect(db.query.researchProjects).toBeDefined();
    expect(db.query.publications).toBeDefined();
    expect(db.query.publicationAuthors).toBeDefined();
    expect(db.query.news).toBeDefined();
    expect(db.query.events).toBeDefined();
    expect(db.query.galleryMedia).toBeDefined();
    expect(db.query.vehicles).toBeDefined();
    expect(db.query.vehicleAssignments).toBeDefined();
    expect(db.query.contactMessages).toBeDefined();
    expect(db.query.systemSettings).toBeDefined();
  });
});
