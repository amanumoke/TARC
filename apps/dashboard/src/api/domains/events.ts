import { del, get, post, put } from '../client';
import { endpoints } from '../endpoints';
import type { EventDTO, EventInput } from '../types';

interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number };
}

export function listEvents(params?: ListParams): Promise<PaginatedResponse<EventDTO>> {
  return get<PaginatedResponse<EventDTO>>(endpoints.events.list, {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export function getEvent(id: string): Promise<EventDTO> {
  return get<EventDTO>(endpoints.events.byId(id));
}

export function createEvent(data: EventInput): Promise<EventDTO> {
  return post<EventDTO>(endpoints.events.list, data);
}

export function updateEvent(id: string, data: Partial<EventInput>): Promise<EventDTO> {
  return put<EventDTO>(endpoints.events.byId(id), data);
}

export function deleteEvent(id: string): Promise<void> {
  return del<void>(endpoints.events.byId(id));
}
