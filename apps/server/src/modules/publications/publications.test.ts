/**
 * @file apps/server/src/modules/publications/publications.test.ts
 * @description Unit tests for publications service module.
 */

import { describe, expect, it, vi } from 'vitest';

vi.mock('../../db/client.js', () => ({
  db: {},
}));

vi.mock('../../db/schema/index.js', () => ({
  publications: {},
  publicationAuthors: {},
}));

describe('Publications Service', () => {
  it('exports getAllPublications function', async () => {
    const mod = await import('./publications.service.js');
    expect(typeof mod.getAllPublications).toBe('function');
  });

  it('exports getFeaturedPublications function', async () => {
    const mod = await import('./publications.service.js');
    expect(typeof mod.getFeaturedPublications).toBe('function');
  });

  it('exports getPublicationById function', async () => {
    const mod = await import('./publications.service.js');
    expect(typeof mod.getPublicationById).toBe('function');
  });

  it('exports createPublicationWithAuthors function', async () => {
    const mod = await import('./publications.service.js');
    expect(typeof mod.createPublicationWithAuthors).toBe('function');
  });

  it('exports deletePublication function', async () => {
    const mod = await import('./publications.service.js');
    expect(typeof mod.deletePublication).toBe('function');
  });
});
