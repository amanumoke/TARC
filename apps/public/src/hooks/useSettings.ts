import { useQuery } from '@tanstack/react-query';

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await fetch('/api/v1/settings');
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to fetch settings');
      return json.data;
    },
  });
}
