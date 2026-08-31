import { get } from '../client';
import { endpoints } from '../endpoints';
import type { SystemSettingsDTO } from '../types';

export function getSettings(): Promise<SystemSettingsDTO> {
  return get<SystemSettingsDTO>(endpoints.settings);
}
