import { useQuery } from '@tanstack/react-query';

export interface NewsItem {
  id: string;
  title: string;
  name?: string;
  slug: string;
  summary?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  publishedAt?: string;
  createdAt: string;
  imageUrl?: string;
}

interface NewsResponse {
  success: boolean;
  data: NewsItem[];
  error?: { message: string };
}

export function useNews(params?: { limit?: number; category?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.limit) searchParams.set('limit', String(params.limit));
  if (params?.category) searchParams.set('category', params.category);

  return useQuery<NewsItem[]>({
    queryKey: ['news', params],
    queryFn: async () => {
      const res = await fetch(`/api/v1/communication/news?${searchParams}`);
      const json: NewsResponse = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to fetch news');
      return json.data;
    },
  });
}
