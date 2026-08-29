import { useQuery } from '@tanstack/react-query';

export interface StaffMember {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  position?: string | null;
  departmentId?: string | null;
  department?: string | null;
  bio?: string | null;
  expertise?: string[] | null;
  imageUrl?: string;
}

export function useStaff(params?: { departmentId?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.departmentId) searchParams.set('departmentId', params.departmentId);

  return useQuery<StaffMember[]>({
    queryKey: ['staff', params],
    queryFn: async () => {
      const res = await fetch(`/api/v1/staff?${searchParams}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to fetch staff');
      return json.data;
    },
  });
}
