import { get, put } from '../client';
import { endpoints } from '../endpoints';
import type { SystemSettingsDTO, SystemSettingsInput } from '../types';

export function getSettings(): Promise<SystemSettingsDTO> {
  return get<SystemSettingsDTO>(endpoints.settings);
}

export function updateSettings(data: SystemSettingsInput): Promise<SystemSettingsDTO> {
  return put<SystemSettingsDTO>(endpoints.settings, data);
}
