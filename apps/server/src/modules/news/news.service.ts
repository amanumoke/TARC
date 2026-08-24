/**
 * @file apps/server/src/modules/news/news.service.ts
 * @description Service layer for news articles CRUD operations.
 * Handles news publishing with draft/published status and categories.
 */

import { desc, eq } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { news } from '../../db/schema/index.js';
import type { NewNews } from '../../db/schema/index.js';

/**
 * Fetches all news articles ordered by published date descending.
 * @returns Array of news articles
 */
export async function getAllNews() {
  return db.select().from(news).orderBy(desc(news.publishedAt));
}

/**
 * Fetches published news articles for the public portal.
 * @returns Array of published news articles
 */
export async function getPublishedNews() {
  return db.select().from(news).where(eq(news.isPublished, true)).orderBy(desc(news.publishedAt));
}

/**
 * Fetches a single news article by ID.
 * @param id - The news article UUID
 * @returns The news article record or undefined
 */
export async function getNewsById(id: string) {
  const [article] = await db.select().from(news).where(eq(news.id, id));
  return article;
}

/**
 * Creates a new news article.
 * @param data - The news article data to insert
 * @returns The created news article record
 */
export async function createNews(data: NewNews) {
  const [created] = await db.insert(news).values(data).execute();
  return created;
}

/**
 * Updates an existing news article.
 * @param id - The news article UUID to update
 * @param data - Partial news article data to update
 * @returns The updated news article record
 */
export async function updateNews(id: string, data: Partial<NewNews>) {
  await db.update(news).set(data).where(eq(news.id, id));
  return getNewsById(id);
}

/**
 * Deletes a news article by ID.
 * @param id - The news article UUID to delete
 * @returns true on success
 */
export async function deleteNews(id: string): Promise<boolean> {
  await db.delete(news).where(eq(news.id, id));
  return true;
}
