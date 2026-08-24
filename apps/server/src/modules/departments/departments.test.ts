/**
 * @file apps/server/src/modules/departments/departments.test.ts
 * @description Unit tests for department service module.
 */

import { describe, expect, it, vi } from 'vitest';

vi.mock('../../db/client.js', () => ({
  db: {},
}));

vi.mock('../../db/schema/index.js', () => ({
  departments: {},
}));

describe('Departments Service', () => {
  it('exports getAllDepartments function', async () => {
    const mod = await import('./departments.service.js');
    expect(typeof mod.getAllDepartments).toBe('function');
  });

  it('exports getDepartmentById function', async () => {
    const mod = await import('./departments.service.js');
    expect(typeof mod.getDepartmentById).toBe('function');
  });

  it('exports createDepartment function', async () => {
    const mod = await import('./departments.service.js');
    expect(typeof mod.createDepartment).toBe('function');
  });

  it('exports updateDepartment function', async () => {
    const mod = await import('./departments.service.js');
    expect(typeof mod.updateDepartment).toBe('function');
  });

  it('exports deleteDepartment function', async () => {
    const mod = await import('./departments.service.js');
    expect(typeof mod.deleteDepartment).toBe('function');
  });
});
