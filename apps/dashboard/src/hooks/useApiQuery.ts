import { ApiError, get } from '@/api/client';
import { useQuery } from '@tanstack/react-query';

function stripBasePrefix(endpoint: string): string {
  return endpoint.replace(/^\/api\/v1/, '') || '/';
}

interface UseApiQueryOptions<T> {
  queryKey: (string | number)[];
  endpoint: string;
  enabled?: boolean;
  select?: (data: unknown) => T;
}

export function useApiQuery<T>({
  queryKey,
  endpoint,
  enabled = true,
  select,
}: UseApiQueryOptions<T>) {
  return useQuery({
    queryKey,
    enabled,
    queryFn: async (): Promise<T> => {
      try {
        const raw = await get<unknown>(stripBasePrefix(endpoint));
        const normalized = Array.isArray(raw) ? { data: raw } : raw;
        return select ? select(normalized) : (normalized as T);
      } catch (error) {
        if (error instanceof ApiError) {
          throw new Error(error.message);
        }
        throw error;
      }
    },
  });
}
