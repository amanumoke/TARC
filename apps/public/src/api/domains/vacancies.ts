import { get } from '../client';
import { endpoints } from '../endpoints';
import type { VacancyDTO } from '../types';

export function getVacancies(): Promise<VacancyDTO[]> {
  return get<VacancyDTO[]>(endpoints.vacancies);
}
