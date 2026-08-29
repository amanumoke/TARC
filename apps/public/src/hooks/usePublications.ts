import { useQuery } from '@tanstack/react-query';

export interface PublicationItem {
  id: string;
  title: string;
  slug?: string;
  authors?: string[];
  abstract?: string;
  description?: string;
  type?: string;
  year?: string;
  doiUrl?: string;
  doi?: string;
  createdAt: string;
}

interface PublicationsResponse {
  success: boolean;
  data: PublicationItem[];
  error?: { message: string };
}

export function usePublications(params?: { year?: string; type?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.year) searchParams.set('year', params.year);
  if (params?.type) searchParams.set('type', params.type);

  return useQuery<PublicationItem[]>({
    queryKey: ['publications', params],
    queryFn: async () => {
      const res = await fetch(`/api/v1/publications?${searchParams}`);
      const json: PublicationsResponse = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to fetch publications');
      return json.data;
    },
  });
}
