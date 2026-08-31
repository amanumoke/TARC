import { get } from '../client';
import { endpoints } from '../endpoints';
import type { DepartmentDTO } from '../types';

export function getDepartments(): Promise<DepartmentDTO[]> {
  return get<DepartmentDTO[]>(endpoints.departments);
}
