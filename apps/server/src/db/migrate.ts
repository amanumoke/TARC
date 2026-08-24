/**
 * @file apps/server/src/db/migrate.ts
 * @description Programmatic database migration runner for Drizzle ORM.
 * Applies pending SQL migration scripts from `src/db/migrations` to the active MySQL database.
 */

import { migrate } from 'drizzle-orm/mysql2/migrator';
import { db, poolConnection } from './client.js';

/**
 * Executes pending database migrations.
 */
export async function runMigrations() {
  console.log('⏳ Running Drizzle migrations on MySQL database...');
  try {
    await migrate(db, { migrationsFolder: './src/db/migrations' });
    console.log('✅ Drizzle migrations completed successfully.');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await poolConnection.end();
  }
}

// Execute directly if run via CLI `node src/db/migrate.js` or `tsx src/db/migrate.ts`
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations();
}
