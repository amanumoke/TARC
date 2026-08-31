import { useQuery } from '@tanstack/react-query';
import { getDepartments } from '../domains/departments';

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: getDepartments,
  });
}
