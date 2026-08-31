import { del, get, post, put } from '../client';
import { endpoints } from '../endpoints';
import type { ResearchProgramDTO, ResearchProgramInput } from '../types';

interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number };
}

export function listPrograms(params?: ListParams): Promise<PaginatedResponse<ResearchProgramDTO>> {
  return get<PaginatedResponse<ResearchProgramDTO>>(endpoints.programs.list, {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export function getProgram(id: string): Promise<ResearchProgramDTO> {
  return get<ResearchProgramDTO>(endpoints.programs.byId(id));
}

export function createProgram(data: ResearchProgramInput): Promise<ResearchProgramDTO> {
  return post<ResearchProgramDTO>(endpoints.programs.list, data);
}

export function updateProgram(
  id: string,
  data: Partial<ResearchProgramInput>
): Promise<ResearchProgramDTO> {
  return put<ResearchProgramDTO>(endpoints.programs.byId(id), data);
}

export function deleteProgram(id: string): Promise<void> {
  return del<void>(endpoints.programs.byId(id));
}
