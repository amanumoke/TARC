import { get } from '../client';
import { endpoints } from '../endpoints';
import type { PublicationDTO } from '../types';

interface PublicationParams {
  year?: string;
  type?: string;
}

export function getPublications(params?: PublicationParams): Promise<PublicationDTO[]> {
  return get<PublicationDTO[]>(endpoints.publications, {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}
