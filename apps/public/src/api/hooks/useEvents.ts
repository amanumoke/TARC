import { useQuery } from '@tanstack/react-query';
import { getEvents } from '../domains/events';

interface UseEventsParams {
  limit?: number;
  upcoming?: boolean;
}

export function useEvents(params?: UseEventsParams) {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => getEvents(params),
  });
}
