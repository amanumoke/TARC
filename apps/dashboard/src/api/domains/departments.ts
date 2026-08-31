import { del, get, post, put } from '../client';
import { endpoints } from '../endpoints';
import type { DepartmentDTO, DepartmentInput } from '../types';

interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number };
}

export function listDepartments(params?: ListParams): Promise<PaginatedResponse<DepartmentDTO>> {
  return get<PaginatedResponse<DepartmentDTO>>(endpoints.departments.list, {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export function getDepartment(id: string): Promise<DepartmentDTO> {
  return get<DepartmentDTO>(endpoints.departments.byId(id));
}

export function createDepartment(data: DepartmentInput): Promise<DepartmentDTO> {
  return post<DepartmentDTO>(endpoints.departments.list, data);
}

export function updateDepartment(
  id: string,
  data: Partial<DepartmentInput>
): Promise<DepartmentDTO> {
  return put<DepartmentDTO>(endpoints.departments.byId(id), data);
}

export function deleteDepartment(id: string): Promise<void> {
  return del<void>(endpoints.departments.byId(id));
}
