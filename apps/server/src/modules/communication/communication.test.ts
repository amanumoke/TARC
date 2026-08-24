/**
 * @file apps/server/src/modules/communication/communication.test.ts
 * @description Unit tests for communication services (news, events, gallery).
 */

import { describe, expect, it, vi } from 'vitest';

vi.mock('../../db/client.js', () => ({
  db: {},
}));

vi.mock('../../db/schema/index.js', () => ({
  news: {},
  events: {},
  galleryMedia: {},
}));

describe('News Service', () => {
  it('exports getAllNews function', async () => {
    const mod = await import('../news/news.service.js');
    expect(typeof mod.getAllNews).toBe('function');
  });

  it('exports getPublishedNews function', async () => {
    const mod = await import('../news/news.service.js');
    expect(typeof mod.getPublishedNews).toBe('function');
  });

  it('exports getNewsById function', async () => {
    const mod = await import('../news/news.service.js');
    expect(typeof mod.getNewsById).toBe('function');
  });

  it('exports createNews function', async () => {
    const mod = await import('../news/news.service.js');
    expect(typeof mod.createNews).toBe('function');
  });

  it('exports updateNews function', async () => {
    const mod = await import('../news/news.service.js');
    expect(typeof mod.updateNews).toBe('function');
  });

  it('exports deleteNews function', async () => {
    const mod = await import('../news/news.service.js');
    expect(typeof mod.deleteNews).toBe('function');
  });
});

describe('Events Service', () => {
  it('exports getAllEvents function', async () => {
    const mod = await import('../events/events.service.js');
    expect(typeof mod.getAllEvents).toBe('function');
  });

  it('exports getUpcomingEvents function', async () => {
    const mod = await import('../events/events.service.js');
    expect(typeof mod.getUpcomingEvents).toBe('function');
  });

  it('exports getPastEvents function', async () => {
    const mod = await import('../events/events.service.js');
    expect(typeof mod.getPastEvents).toBe('function');
  });

  it('exports getEventById function', async () => {
    const mod = await import('../events/events.service.js');
    expect(typeof mod.getEventById).toBe('function');
  });

  it('exports createEvent function', async () => {
    const mod = await import('../events/events.service.js');
    expect(typeof mod.createEvent).toBe('function');
  });

  it('exports updateEvent function', async () => {
    const mod = await import('../events/events.service.js');
    expect(typeof mod.updateEvent).toBe('function');
  });

  it('exports deleteEvent function', async () => {
    const mod = await import('../events/events.service.js');
    expect(typeof mod.deleteEvent).toBe('function');
  });
});

describe('Gallery Service', () => {
  it('exports getAllGalleryMedia function', async () => {
    const mod = await import('../gallery/gallery.service.js');
    expect(typeof mod.getAllGalleryMedia).toBe('function');
  });

  it('exports getGalleryByCategory function', async () => {
    const mod = await import('../gallery/gallery.service.js');
    expect(typeof mod.getGalleryByCategory).toBe('function');
  });

  it('exports getGalleryMediaById function', async () => {
    const mod = await import('../gallery/gallery.service.js');
    expect(typeof mod.getGalleryMediaById).toBe('function');
  });

  it('exports createGalleryMedia function', async () => {
    const mod = await import('../gallery/gallery.service.js');
    expect(typeof mod.createGalleryMedia).toBe('function');
  });

  it('exports deleteGalleryMedia function', async () => {
    const mod = await import('../gallery/gallery.service.js');
    expect(typeof mod.deleteGalleryMedia).toBe('function');
  });
});
