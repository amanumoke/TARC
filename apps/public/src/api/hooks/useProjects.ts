import { useQuery } from '@tanstack/react-query';
import { getPrograms, getProjects } from '../domains/projects';

interface UseProjectsParams {
  programId?: string;
  status?: string;
}

export function usePrograms() {
  return useQuery({
    queryKey: ['programs'],
    queryFn: getPrograms,
  });
}

export function useProjects(params?: UseProjectsParams) {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => getProjects(params),
  });
}
