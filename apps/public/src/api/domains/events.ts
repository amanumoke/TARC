import { get } from '../client';
import { endpoints } from '../endpoints';
import type { EventDTO } from '../types';

interface EventParams {
  limit?: number;
  upcoming?: boolean;
}

export function getEvents(params?: EventParams): Promise<EventDTO[]> {
  return get<EventDTO[]>(endpoints.events, {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export function getUpcomingEvents(): Promise<EventDTO[]> {
  return get<EventDTO[]>(endpoints.eventsUpcoming);
}
