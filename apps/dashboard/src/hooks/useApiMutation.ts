import { useMutation, useQueryClient } from '@tanstack/react-query';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('tarcms_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

interface UseApiMutationOptions<TData, TVariables> {
  endpoint: string;
  method?: string;
  queryKeyToInvalidate?: string[];
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
}

export function useApiMutation<TData, TVariables = unknown>({
  endpoint,
  method = 'POST',
  queryKeyToInvalidate,
  onSuccess,
  onError,
}: UseApiMutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: TVariables): Promise<TData> => {
      const response = await fetch(endpoint, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(variables),
      });
      const json = await response.json();
      if (!json.success) {
        throw new Error(json.error?.message || 'Request failed');
      }
      return json.data as TData;
    },
    onSuccess: (data) => {
      if (queryKeyToInvalidate) {
        for (const key of queryKeyToInvalidate) {
          queryClient.invalidateQueries({ queryKey: [key] });
        }
      }
      onSuccess?.(data);
    },
    onError,
  });
}
