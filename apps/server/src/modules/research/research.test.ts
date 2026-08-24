/**
 * @file apps/server/src/modules/research/research.test.ts
 * @description Unit tests for research programs and projects services.
 */

import { describe, expect, it, vi } from 'vitest';

vi.mock('../../db/client.js', () => ({
  db: {},
}));

vi.mock('../../db/schema/index.js', () => ({
  researchPrograms: {},
  researchProjects: {},
}));

describe('Research Programs Service', () => {
  it('exports getAllPrograms function', async () => {
    const mod = await import('./programs.service.js');
    expect(typeof mod.getAllPrograms).toBe('function');
  });

  it('exports getActivePrograms function', async () => {
    const mod = await import('./programs.service.js');
    expect(typeof mod.getActivePrograms).toBe('function');
  });

  it('exports getProgramById function', async () => {
    const mod = await import('./programs.service.js');
    expect(typeof mod.getProgramById).toBe('function');
  });

  it('exports createProgram function', async () => {
    const mod = await import('./programs.service.js');
    expect(typeof mod.createProgram).toBe('function');
  });

  it('exports updateProgram function', async () => {
    const mod = await import('./programs.service.js');
    expect(typeof mod.updateProgram).toBe('function');
  });

  it('exports deleteProgram function', async () => {
    const mod = await import('./programs.service.js');
    expect(typeof mod.deleteProgram).toBe('function');
  });
});

describe('Research Projects Service', () => {
  it('exports getAllProjects function', async () => {
    const mod = await import('./projects.service.js');
    expect(typeof mod.getAllProjects).toBe('function');
  });

  it('exports getActiveProjects function', async () => {
    const mod = await import('./projects.service.js');
    expect(typeof mod.getActiveProjects).toBe('function');
  });

  it('exports getProjectById function', async () => {
    const mod = await import('./projects.service.js');
    expect(typeof mod.getProjectById).toBe('function');
  });

  it('exports createProject function', async () => {
    const mod = await import('./projects.service.js');
    expect(typeof mod.createProject).toBe('function');
  });

  it('exports updateProject function', async () => {
    const mod = await import('./projects.service.js');
    expect(typeof mod.updateProject).toBe('function');
  });

  it('exports deleteProject function', async () => {
    const mod = await import('./projects.service.js');
    expect(typeof mod.deleteProject).toBe('function');
  });
});
