/**
 * @file apps/server/src/db/schema/index.ts
 * @description Central export index for all Drizzle ORM tables and relational mappings.
 * Serves as the single database schema definition passed into the Drizzle client.
 */

export * from './users';
export * from './departments';
export * from './staff';
export * from './research';
export * from './publications';
export * from './communication';
export * from './vehicles';
export * from './messages';
export * from './settings';
