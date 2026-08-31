import { ApiError, del, post, put } from '@/api/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function stripBasePrefix(endpoint: string): string {
  return endpoint.replace(/^\/api\/v1/, '') || '/';
}

type HttpMethod = 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type MutateFn = <T>(
  endpoint: string,
  body?: unknown,
  options?: Parameters<typeof post>[2]
) => Promise<T>;

const methodFns: Record<HttpMethod, MutateFn> = {
  POST: post as MutateFn,
  PUT: put as MutateFn,
  PATCH: put as MutateFn,
  DELETE: ((endpoint: string) => del(endpoint)) as unknown as MutateFn,
};

interface UseApiMutationOptions<TData, TVariables> {
  endpoint: string;
  method?: HttpMethod;
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
      try {
        const fn = methodFns[method];
        const path = stripBasePrefix(endpoint);
        if (method === 'DELETE') {
          return await fn<TData>(path);
        }
        return await fn<TData>(path, variables);
      } catch (error) {
        if (error instanceof ApiError) {
          throw new Error(error.message);
        }
        throw error;
      }
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
