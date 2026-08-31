import { del, get, post, put } from '../client';
import { endpoints } from '../endpoints';
import type {
  VehicleAssignmentDTO,
  VehicleDTO,
  VehicleInput,
  VehicleRequisitionInput,
} from '../types';

interface ListParams {
  page?: number;
  limit?: number;
  search?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; limit: number };
}

export function listVehicles(params?: ListParams): Promise<PaginatedResponse<VehicleDTO>> {
  return get<PaginatedResponse<VehicleDTO>>(endpoints.vehicles.list, {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export function getVehicle(id: string): Promise<VehicleDTO> {
  return get<VehicleDTO>(endpoints.vehicles.byId(id));
}

export function createVehicle(data: VehicleInput): Promise<VehicleDTO> {
  return post<VehicleDTO>(endpoints.vehicles.list, data);
}

export function updateVehicleStatus(id: string, status: string): Promise<VehicleDTO> {
  return put<VehicleDTO>(endpoints.vehicles.status(id), { status });
}

export function deleteVehicle(id: string): Promise<void> {
  return del<void>(endpoints.vehicles.byId(id));
}

export function listAssignments(
  params?: ListParams
): Promise<PaginatedResponse<VehicleAssignmentDTO>> {
  return get<PaginatedResponse<VehicleAssignmentDTO>>(endpoints.assignments.list, {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export function createAssignment(data: VehicleRequisitionInput): Promise<VehicleAssignmentDTO> {
  return post<VehicleAssignmentDTO>(endpoints.assignments.list, data);
}

export function updateAssignmentStatus(id: string, status: string): Promise<VehicleAssignmentDTO> {
  return put<VehicleAssignmentDTO>(endpoints.assignments.status(id), { status });
}
