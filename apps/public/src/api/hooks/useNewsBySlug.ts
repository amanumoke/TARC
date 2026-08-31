import { useQuery } from '@tanstack/react-query';
import { getNewsBySlug } from '../domains/news';

export function useNewsBySlug(slug: string) {
  return useQuery({
    queryKey: ['news', slug],
    queryFn: () => getNewsBySlug(slug),
    enabled: !!slug,
  });
}
