import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { db, poolConnection } from './client.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Executes pending database migrations.
 */
export async function runMigrations() {
  console.log('⏳ Running Drizzle migrations on MySQL database...');
  try {
    const migrationsFolder = path.join(__dirname, 'migrations');
    await migrate(db, { migrationsFolder });
    console.log('✅ Drizzle migrations completed successfully.');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await poolConnection.end();
  }
}

runMigrations();

