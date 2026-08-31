import { del, get, post, put } from '../client';
import { endpoints } from '../endpoints';
import type { NewsDTO, NewsInput } from '../types';

interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number };
}

export function listNews(params?: ListParams): Promise<PaginatedResponse<NewsDTO>> {
  return get<PaginatedResponse<NewsDTO>>(endpoints.news.list, {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export function getNewsArticle(id: string): Promise<NewsDTO> {
  return get<NewsDTO>(endpoints.news.byId(id));
}

export function createNewsArticle(data: NewsInput): Promise<NewsDTO> {
  return post<NewsDTO>(endpoints.news.list, data);
}

export function updateNewsArticle(id: string, data: Partial<NewsInput>): Promise<NewsDTO> {
  return put<NewsDTO>(endpoints.news.byId(id), data);
}

export function deleteNewsArticle(id: string): Promise<void> {
  return del<void>(endpoints.news.byId(id));
}
