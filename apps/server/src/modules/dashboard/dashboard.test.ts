import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getDashboardMetrics } from './dashboard.service.js';

vi.mock('../../db/client.js', () => ({
  db: {
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockResolvedValue([{ total: 10, active: 5 }]),
  },
}));

vi.mock('../../db/schema/index.js', () => ({
  researchProjects: {},
  publications: {},
  staff: {},
  vehicles: {},
  contactMessages: {},
}));

describe('Dashboard Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns dashboard metrics', async () => {
    const metrics = await getDashboardMetrics();
    expect(metrics).toHaveProperty('totalProjects');
    expect(metrics).toHaveProperty('activeProjects');
    expect(metrics).toHaveProperty('totalPublications');
    expect(metrics).toHaveProperty('totalStaff');
    expect(metrics).toHaveProperty('availableVehicles');
    expect(metrics).toHaveProperty('totalVehicles');
    expect(metrics).toHaveProperty('unreadMessages');
  });
});
