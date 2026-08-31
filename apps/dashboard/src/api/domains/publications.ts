import { del, get, post, put } from '../client';
import { endpoints } from '../endpoints';
import type { PublicationDTO, PublicationInput } from '../types';

interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number };
}

export function listPublications(params?: ListParams): Promise<PaginatedResponse<PublicationDTO>> {
  return get<PaginatedResponse<PublicationDTO>>(endpoints.publications.list, {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export function getPublication(id: string): Promise<PublicationDTO> {
  return get<PublicationDTO>(endpoints.publications.byId(id));
}

export function createPublication(data: PublicationInput): Promise<PublicationDTO> {
  return post<PublicationDTO>(endpoints.publications.list, data);
}

export function updatePublication(
  id: string,
  data: Partial<PublicationInput>
): Promise<PublicationDTO> {
  return put<PublicationDTO>(endpoints.publications.byId(id), data);
}

export function deletePublication(id: string): Promise<void> {
  return del<void>(endpoints.publications.byId(id));
}
