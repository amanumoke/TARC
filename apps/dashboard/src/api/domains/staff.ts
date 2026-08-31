import { del, get, post, put } from '../client';
import { endpoints } from '../endpoints';
import type { StaffDTO, StaffInput } from '../types';

interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number };
}

export function listStaff(params?: ListParams): Promise<PaginatedResponse<StaffDTO>> {
  return get<PaginatedResponse<StaffDTO>>(endpoints.staff.list, {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export function getStaffMember(id: string): Promise<StaffDTO> {
  return get<StaffDTO>(endpoints.staff.byId(id));
}

export function createStaffMember(data: StaffInput): Promise<StaffDTO> {
  return post<StaffDTO>(endpoints.staff.list, data);
}

export function updateStaffMember(id: string, data: Partial<StaffInput>): Promise<StaffDTO> {
  return put<StaffDTO>(endpoints.staff.byId(id), data);
}

export function deleteStaffMember(id: string): Promise<void> {
  return del<void>(endpoints.staff.byId(id));
}
