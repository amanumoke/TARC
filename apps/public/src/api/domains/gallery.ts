import { get } from '../client';
import { endpoints } from '../endpoints';
import type { GalleryMediaDTO } from '../types';

interface GalleryParams {
  category?: string;
}

export function getGallery(params?: GalleryParams): Promise<GalleryMediaDTO[]> {
  if (params?.category) {
    return get<GalleryMediaDTO[]>(endpoints.galleryByCategory(params.category));
  }
  return get<GalleryMediaDTO[]>(endpoints.gallery);
}
