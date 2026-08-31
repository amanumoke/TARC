import { useQuery } from '@tanstack/react-query';
import { getNews } from '../domains/news';

interface UseNewsParams {
  limit?: number;
  category?: string;
}

export function useNews(params?: UseNewsParams) {
  return useQuery({
    queryKey: ['news', params],
    queryFn: () => getNews(params),
  });
}
