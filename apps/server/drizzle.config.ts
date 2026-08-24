/**
 * @file apps/server/drizzle.config.ts
 * @description Drizzle Kit CLI configuration for database migrations and schema introspection.
 * Connects to MySQL 8.0 instance using the DATABASE_URL environment variable.
 */

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema/index.ts',
  out: './src/db/migrations',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'mysql://tarc_user:tarc_password@localhost:3306/tarcms_db',
  },
  verbose: true,
  strict: true,
});
