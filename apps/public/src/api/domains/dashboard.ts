import { get } from '../client';
import { endpoints } from '../endpoints';
import type { DashboardMetricsDTO } from '../types';

export function getMetrics(): Promise<DashboardMetricsDTO> {
  return get<DashboardMetricsDTO>(endpoints.metrics);
}
