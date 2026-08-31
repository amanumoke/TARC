import { useQuery } from '@tanstack/react-query';
import { getSettings } from '../domains/settings';

export function useSettings() {
  return useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  });
}
