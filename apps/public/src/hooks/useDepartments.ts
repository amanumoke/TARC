import { useQuery } from '@tanstack/react-query';

export interface Department {
  id: string;
  name: string;
  slug?: string;
  description?: string | null;
  objectives?: string[];
  head?: string;
  email?: string;
  phone?: string;
  establishedYear?: number | null;
}

export function useDepartments() {
  return useQuery<Department[]>({
    queryKey: ['departments'],
    queryFn: async () => {
      const res = await fetch('/api/v1/departments');
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to fetch departments');
      return json.data;
    },
  });
}
