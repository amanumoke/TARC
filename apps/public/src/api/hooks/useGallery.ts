import { useQuery } from '@tanstack/react-query';
import { getGallery } from '../domains/gallery';

interface UseGalleryParams {
  category?: string;
}

export function useGallery(params?: UseGalleryParams) {
  return useQuery({
    queryKey: ['gallery', params],
    queryFn: () => getGallery(params),
  });
}
