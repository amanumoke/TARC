/**
 * @file apps/server/src/config/database.ts
 * @description Database configuration module for TARCMS backend.
 * Reads connection settings from environment variables with sensible local development fallbacks.
 */

import dotenv from 'dotenv';

// Load environment variables from .env file into process.env
dotenv.config();

/**
 * Database connection pool configuration options.
 */
export const databaseConfig = {
  /** Connection URI formatted as mysql://<user>:<password>@<host>:<port>/<database> */
  url: process.env.DATABASE_URL || 'mysql://tarc_user:tarc_password@localhost:3306/tarcms_db',

  /** Maximum number of concurrent database connections in the pool */
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),

  /** Maximum number of connection requests the pool will queue before returning an error (0 = unlimited) */
  queueLimit: 0,

  /** Determines whether the pool should wait for connections when the limit is reached */
  waitForConnections: true,
};
