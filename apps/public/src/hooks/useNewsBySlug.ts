import { useQuery } from '@tanstack/react-query';
import type { NewsItem } from './useNews';

export function useNewsBySlug(slug: string) {
  return useQuery<NewsItem | null>({
    queryKey: ['news', slug],
    enabled: !!slug,
    queryFn: async () => {
      const res = await fetch(`/api/v1/communication/news/${slug}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to fetch article');
      return json.data;
    },
  });
}
