import { useQuery } from '@tanstack/react-query';

export interface GalleryItem {
  id: string;
  title: string;
  caption?: string | null;
  category: string;
  imageUrl: string;
  thumbnailUrl?: string | null;
}

export function useGallery(params?: { category?: string }) {
  const searchParams = new URLSearchParams();
  if (params?.category) searchParams.set('category', params.category);

  return useQuery<GalleryItem[]>({
    queryKey: ['gallery', params],
    queryFn: async () => {
      const res = await fetch(`/api/v1/communication/gallery?${searchParams}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error?.message || 'Failed to fetch gallery');
      return json.data;
    },
  });
}
