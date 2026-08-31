import { get } from '../client';
import { endpoints } from '../endpoints';
import type { NewsDTO } from '../types';

interface NewsParams {
  limit?: number;
  category?: string;
}

export function getNews(params?: NewsParams): Promise<NewsDTO[]> {
  return get<NewsDTO[]>(endpoints.news, {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export function getNewsBySlug(slug: string): Promise<NewsDTO> {
  return get<NewsDTO>(endpoints.newsBySlug(slug));
}
