import { useQuery } from '@tanstack/react-query';
import { getMetrics } from '../domains/dashboard';

export function useMetrics() {
  return useQuery({
    queryKey: ['metrics'],
    queryFn: getMetrics,
  });
}
