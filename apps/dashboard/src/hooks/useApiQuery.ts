import { useQuery } from '@tanstack/react-query';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('tarcms_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
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
      const response = await fetch(endpoint, { headers: getAuthHeaders() });
      const json = await response.json();
      if (!json.success) {
        throw new Error(json.error?.message || 'Request failed');
      }
      return select ? select(json.data) : (json.data as T);
    },
  });
}
