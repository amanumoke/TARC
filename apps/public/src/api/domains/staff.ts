import { get } from '../client';
import { endpoints } from '../endpoints';
import type { StaffDTO } from '../types';

interface StaffParams {
  departmentId?: string;
}

export function getStaff(params?: StaffParams): Promise<StaffDTO[]> {
  return get<StaffDTO[]>(endpoints.staff, {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}
