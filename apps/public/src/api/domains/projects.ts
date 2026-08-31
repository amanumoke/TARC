import { get } from '../client';
import { endpoints } from '../endpoints';
import type { ResearchProgramDTO, ResearchProjectDTO } from '../types';

interface ProjectParams {
  programId?: string;
  status?: string;
}

export function getPrograms(): Promise<ResearchProgramDTO[]> {
  return get<ResearchProgramDTO[]>(endpoints.researchPrograms);
}

export function getProjects(params?: ProjectParams): Promise<ResearchProjectDTO[]> {
  return get<ResearchProjectDTO[]>(endpoints.researchProjects, {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}
