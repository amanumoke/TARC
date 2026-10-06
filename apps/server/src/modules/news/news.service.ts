/**
 * @file apps/server/src/modules/news/news.service.ts
 * @description Service layer for news articles CRUD operations.
 * Handles news publishing with draft/published status and categories.
 */

import { randomUUID } from 'node:crypto';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '../../db/client.js';
import { news, users } from '../../db/schema/index.js';

const validCategories = ['RESEARCH_NEWS', 'INSTITUTIONAL', 'FARMER_ADVISORY', 'EVENTS'] as const;
type NewsCategoryType = (typeof validCategories)[number];

const categoryAliases: Record<string, NewsCategoryType> = {
  RESEARCH_NEWS: 'RESEARCH_NEWS',
  INSTITUTIONAL: 'INSTITUTIONAL',
  FARMER_ADVISORY: 'FARMER_ADVISORY',
  EVENTS: 'EVENTS',
  EVENT: 'EVENTS',
  ANNOUNCEMENT: 'INSTITUTIONAL',
  RESEARCH_HIGHLIGHT: 'RESEARCH_NEWS',
  ACHIEVEMENT: 'INSTITUTIONAL',
  PARTNERSHIP: 'INSTITUTIONAL',
  OTHER: 'INSTITUTIONAL',
};

function normalizeCategory(cat?: string): NewsCategoryType {
  if (!cat) return 'INSTITUTIONAL';
  const upper = cat.trim().toUpperCase();
  return categoryAliases[upper] || 'INSTITUTIONAL';
}

function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base || `news-${Date.now()}`;
}

function parsePublishedAt(pubDate?: string | Date | null, isPublished = false): Date | null {
  if (pubDate instanceof Date) return pubDate;
  if (typeof pubDate === 'string' && pubDate.trim() !== '') {
    const parsed = new Date(pubDate);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return isPublished ? new Date() : null;
}

/**
 * Fetches all news articles ordered by published date descending,
 * joined with user table to include author display name.
 * @returns Array of news articles
 */
export async function getAllNews() {
  return db
    .select({
      id: news.id,
      authorId: news.authorId,
      authorName: users.name,
      title: news.title,
      slug: news.slug,
      summary: news.summary,
      content: news.content,
      category: news.category,
      coverImageUrl: news.coverImageUrl,
      isPublished: news.isPublished,
      isFeatured: news.isFeatured,
      publishedAt: news.publishedAt,
      createdAt: news.createdAt,
      updatedAt: news.updatedAt,
    })
    .from(news)
    .leftJoin(users, eq(news.authorId, users.id))
    .orderBy(desc(news.publishedAt));
}

/**
 * Fetches published news articles for the public portal.
 * @returns Array of published news articles
 */
export async function getPublishedNews() {
  return db
    .select({
      id: news.id,
      authorId: news.authorId,
      authorName: users.name,
      title: news.title,
      slug: news.slug,
      summary: news.summary,
      content: news.content,
      category: news.category,
      coverImageUrl: news.coverImageUrl,
      isPublished: news.isPublished,
      isFeatured: news.isFeatured,
      publishedAt: news.publishedAt,
      createdAt: news.createdAt,
      updatedAt: news.updatedAt,
    })
    .from(news)
    .leftJoin(users, eq(news.authorId, users.id))
    .where(eq(news.isPublished, true))
    .orderBy(desc(news.publishedAt));
}

/**
 * Fetches a single news article by ID.
 * @param id - The news article UUID
 * @returns The news article record or undefined
 */
export async function getNewsById(id: string) {
  const [article] = await db
    .select({
      id: news.id,
      authorId: news.authorId,
      authorName: users.name,
      title: news.title,
      slug: news.slug,
      summary: news.summary,
      content: news.content,
      category: news.category,
      coverImageUrl: news.coverImageUrl,
      isPublished: news.isPublished,
      isFeatured: news.isFeatured,
      publishedAt: news.publishedAt,
      createdAt: news.createdAt,
      updatedAt: news.updatedAt,
    })
    .from(news)
    .leftJoin(users, eq(news.authorId, users.id))
    .where(eq(news.id, id));
  return article;
}

/**
 * Fetches a single published news article by slug.
 * @param slug - The URL-safe article slug
 * @returns The published article record or undefined
 */
export async function getNewsBySlug(slug: string) {
  const [article] = await db
    .select({
      id: news.id,
      authorId: news.authorId,
      authorName: users.name,
      title: news.title,
      slug: news.slug,
      summary: news.summary,
      content: news.content,
      category: news.category,
      coverImageUrl: news.coverImageUrl,
      isPublished: news.isPublished,
      isFeatured: news.isFeatured,
      publishedAt: news.publishedAt,
      createdAt: news.createdAt,
      updatedAt: news.updatedAt,
    })
    .from(news)
    .leftJoin(users, eq(news.authorId, users.id))
    .where(and(eq(news.slug, slug), eq(news.isPublished, true)));

  return article;
}

/**
 * Creates a new news article.
 * Generates UUID and slug automatically if not provided,
 * normalizes category, and guarantees non-null summary and content.
 * @param data - The news article data to insert
 * @returns The created news article record
 */
export async function createNews(data: {
  id?: string;
  authorId?: string | null;
  title: string;
  slug?: string;
  summary?: string;
  content?: string;
  category?: string;
  coverImageUrl?: string | null;
  isPublished?: boolean;
  isFeatured?: boolean;
  publishedAt?: string | Date | null;
}) {
  const id = data.id || randomUUID();
  let slug = data.slug ? generateSlug(data.slug) : generateSlug(data.title);

  // Check for slug uniqueness collision
  const existing = await db
    .select({ id: news.id })
    .from(news)
    .where(eq(news.slug, slug));
  if (existing.length > 0) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const isPublished = data.isPublished !== undefined ? Boolean(data.isPublished) : true;
  const isFeatured = Boolean(data.isFeatured);
  const summary = data.summary?.trim() || data.title.trim();
  const content = data.content?.trim() || summary;
  const coverImageUrl = data.coverImageUrl?.trim() || null;
  const category = normalizeCategory(data.category);
  const publishedAt = parsePublishedAt(data.publishedAt, isPublished);

  await db
    .insert(news)
    .values({
      id,
      authorId: data.authorId || null,
      title: data.title.trim(),
      slug,
      summary,
      content,
      category,
      coverImageUrl,
      isPublished,
      isFeatured,
      publishedAt,
    })
    .execute();

  return getNewsById(id);
}

/**
 * Updates an existing news article.
 * @param id - The news article UUID to update
 * @param data - Partial news article data to update
 * @returns The updated news article record
 */
export async function updateNews(
  id: string,
  data: Partial<{
    authorId?: string | null;
    title?: string;
    slug?: string;
    summary?: string;
    content?: string;
    category?: string;
    coverImageUrl?: string | null;
    isPublished?: boolean;
    isFeatured?: boolean;
    publishedAt?: string | Date | null;
  }>
) {
  const updatePayload: Record<string, unknown> = {};

  if (data.title !== undefined) {
    updatePayload.title = data.title.trim();
  }
  if (data.slug !== undefined) {
    updatePayload.slug = generateSlug(data.slug);
  }
  if (data.summary !== undefined) {
    updatePayload.summary = data.summary.trim() || updatePayload.title || 'Summary';
  }
  if (data.content !== undefined) {
    updatePayload.content = data.content.trim() || updatePayload.summary || 'Content';
  }
  if (data.category !== undefined) {
    updatePayload.category = normalizeCategory(data.category);
  }
  if (data.coverImageUrl !== undefined) {
    updatePayload.coverImageUrl = data.coverImageUrl?.trim() || null;
  }
  if (data.isFeatured !== undefined) {
    updatePayload.isFeatured = Boolean(data.isFeatured);
  }
  if (data.isPublished !== undefined) {
    updatePayload.isPublished = Boolean(data.isPublished);
    if (data.publishedAt === undefined && updatePayload.isPublished) {
      updatePayload.publishedAt = new Date();
    }
  }
  if (data.publishedAt !== undefined) {
    updatePayload.publishedAt = parsePublishedAt(data.publishedAt, Boolean(data.isPublished));
  }
  if (data.authorId !== undefined) {
    updatePayload.authorId = data.authorId;
  }

  if (Object.keys(updatePayload).length > 0) {
    await db.update(news).set(updatePayload).where(eq(news.id, id));
  }

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
