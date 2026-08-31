import { del, get, post, put } from '../client';
import { endpoints } from '../endpoints';
import type { ResearchProjectDTO, ResearchProjectInput } from '../types';

interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number };
}

export function listProjects(params?: ListParams): Promise<PaginatedResponse<ResearchProjectDTO>> {
  return get<PaginatedResponse<ResearchProjectDTO>>(endpoints.projects.list, {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export function getProject(id: string): Promise<ResearchProjectDTO> {
  return get<ResearchProjectDTO>(endpoints.projects.byId(id));
}

export function createProject(data: ResearchProjectInput): Promise<ResearchProjectDTO> {
  return post<ResearchProjectDTO>(endpoints.projects.list, data);
}

export function updateProject(
  id: string,
  data: Partial<ResearchProjectInput>
): Promise<ResearchProjectDTO> {
  return put<ResearchProjectDTO>(endpoints.projects.byId(id), data);
}

export function deleteProject(id: string): Promise<void> {
  return del<void>(endpoints.projects.byId(id));
}
