import { apiClient, del, get, post, put } from '../client';
import { endpoints } from '../endpoints';
import type { GalleryMediaDTO } from '../types';

interface ListParams {
  search?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number };
}

export function listGallery(params?: ListParams): Promise<PaginatedResponse<GalleryMediaDTO>> {
  return get<PaginatedResponse<GalleryMediaDTO>>(endpoints.gallery.list, {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export function getGalleryMedia(id: string): Promise<GalleryMediaDTO> {
  return get<GalleryMediaDTO>(endpoints.gallery.byId(id));
}

export function uploadGalleryMedia(data: FormData): Promise<GalleryMediaDTO> {
  return apiClient<GalleryMediaDTO>(endpoints.gallery.list, {
    method: 'POST',
    body: data,
    headers: {},
  });
}

export function updateGalleryMedia(
  id: string,
  data: Partial<GalleryMediaDTO>
): Promise<GalleryMediaDTO> {
  return put<GalleryMediaDTO>(endpoints.gallery.byId(id), data);
}

export function deleteGalleryMedia(id: string): Promise<void> {
  return del<void>(endpoints.gallery.byId(id));
}
