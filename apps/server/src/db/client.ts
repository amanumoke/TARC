/**
 * @file apps/server/src/db/client.ts
 * @description MySQL 8.0 connection pool and Drizzle ORM database client instantiation.
 * Exports the singleton `db` instance used for all data access across domain services.
 */

import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { databaseConfig } from '../config/database.js';
import * as schema from './schema/index.js';

/**
 * Underlying MySQL2 connection pool with automatic reconnection and keep-alive.
 */
export const poolConnection = mysql.createPool({
  uri: databaseConfig.url,
  waitForConnections: databaseConfig.waitForConnections,
  connectionLimit: databaseConfig.connectionLimit,
  queueLimit: databaseConfig.queueLimit,
});

/**
 * Strongly typed Drizzle ORM client pre-configured with the complete relational schema.
 * Supports type-safe query builders, relations, and transactions.
 */
export const db = drizzle(poolConnection, { schema, mode: 'default' });

/**
 * Type helper representing the Drizzle database instance.
 */
export type Database = typeof db;
