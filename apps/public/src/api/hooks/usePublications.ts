import { useQuery } from '@tanstack/react-query';
import { getPublications } from '../domains/publications';

interface UsePublicationsParams {
  year?: string;
  type?: string;
}

export function usePublications(params?: UsePublicationsParams) {
  return useQuery({
    queryKey: ['publications', params],
    queryFn: () => getPublications(params),
  });
}
