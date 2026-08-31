import { useQuery } from '@tanstack/react-query';
import { getStaff } from '../domains/staff';

interface UseStaffParams {
  departmentId?: string;
}

export function useStaff(params?: UseStaffParams) {
  return useQuery({
    queryKey: ['staff', params],
    queryFn: () => getStaff(params),
  });
}
