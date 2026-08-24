/**
 * @file apps/server/src/modules/staff/staff.test.ts
 * @description Unit tests for staff service module.
 */

import { describe, expect, it, vi } from 'vitest';

vi.mock('../../db/client.js', () => ({
  db: {},
}));

vi.mock('../../db/schema/index.js', () => ({
  staff: {},
}));

describe('Staff Service', () => {
  it('exports getPublicStaff function', async () => {
    const mod = await import('./staff.service.js');
    expect(typeof mod.getPublicStaff).toBe('function');
  });

  it('exports getAllStaff function', async () => {
    const mod = await import('./staff.service.js');
    expect(typeof mod.getAllStaff).toBe('function');
  });

  it('exports getStaffById function', async () => {
    const mod = await import('./staff.service.js');
    expect(typeof mod.getStaffById).toBe('function');
  });

  it('exports createStaff function', async () => {
    const mod = await import('./staff.service.js');
    expect(typeof mod.createStaff).toBe('function');
  });

  it('exports updateStaff function', async () => {
    const mod = await import('./staff.service.js');
    expect(typeof mod.updateStaff).toBe('function');
  });

  it('exports deleteStaff function', async () => {
    const mod = await import('./staff.service.js');
    expect(typeof mod.deleteStaff).toBe('function');
  });
});
