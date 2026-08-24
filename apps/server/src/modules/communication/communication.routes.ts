/**
 * @file apps/server/src/modules/communication/communication.routes.ts
 * @description Express route definitions for news, events, and gallery endpoints.
 * Includes public and admin routes with RBAC protection.
 */

import { Request, Response, Router } from 'express';
import { authenticateToken } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  getPastEvents,
  getUpcomingEvents,
  updateEvent,
} from '../events/events.service.js';
import {
  createGalleryMedia,
  deleteGalleryMedia,
  getAllGalleryMedia,
  getGalleryByCategory,
  getGalleryMediaById,
} from '../gallery/gallery.service.js';
import {
  createNews,
  deleteNews,
  getAllNews,
  getNewsById,
  getPublishedNews,
  updateNews,
} from '../news/news.service.js';

const router = Router();

// ==================== NEWS ====================

/**
 * Public route - get published news
 */
router.get('/news', async (_req: Request, res: Response) => {
  try {
    const articles = await getPublishedNews();
    res.json({ success: true, data: articles });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch news' });
  }
});

/**
 * Admin route - get all news
 */
router.get(
  '/admin/news',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (_req: Request, res: Response) => {
    try {
      const articles = await getAllNews();
      res.json({ success: true, data: articles });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch news' });
    }
  }
);

/**
 * Admin route - get news by ID
 */
router.get(
  '/admin/news/:id',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const article = await getNewsById(req.params.id);
      if (!article) {
        res.status(404).json({ success: false, error: 'Article not found' });
        return;
      }
      res.json({ success: true, data: article });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch article' });
    }
  }
);

/**
 * Admin route - create a new news article
 */
router.post(
  '/admin/news',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const article = await createNews(req.body);
      res.status(201).json({ success: true, data: article });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to create article' });
    }
  }
);

/**
 * Admin route - update a news article
 */
router.put(
  '/admin/news/:id',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const article = await updateNews(req.params.id, req.body);
      if (!article) {
        res.status(404).json({ success: false, error: 'Article not found' });
        return;
      }
      res.json({ success: true, data: article });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update article' });
    }
  }
);

/**
 * Admin route - delete a news article
 */
router.delete(
  '/admin/news/:id',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      await deleteNews(req.params.id);
      res.json({ success: true, message: 'Article deleted' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to delete article' });
    }
  }
);

// ==================== EVENTS ====================

/**
 * Public route - get upcoming events
 */
router.get('/events/upcoming', async (_req: Request, res: Response) => {
  try {
    const events = await getUpcomingEvents();
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch events' });
  }
});

/**
 * Public route - get past events
 */
router.get('/events/past', async (_req: Request, res: Response) => {
  try {
    const events = await getPastEvents();
    res.json({ success: true, data: events });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch events' });
  }
});

/**
 * Admin route - get all events
 */
router.get(
  '/admin/events',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (_req: Request, res: Response) => {
    try {
      const events = await getAllEvents();
      res.json({ success: true, data: events });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch events' });
    }
  }
);

/**
 * Admin route - get event by ID
 */
router.get(
  '/admin/events/:id',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const event = await getEventById(req.params.id);
      if (!event) {
        res.status(404).json({ success: false, error: 'Event not found' });
        return;
      }
      res.json({ success: true, data: event });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch event' });
    }
  }
);

/**
 * Admin route - create a new event
 */
router.post(
  '/admin/events',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const event = await createEvent(req.body);
      res.status(201).json({ success: true, data: event });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to create event' });
    }
  }
);

/**
 * Admin route - update an event
 */
router.put(
  '/admin/events/:id',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const event = await updateEvent(req.params.id, req.body);
      if (!event) {
        res.status(404).json({ success: false, error: 'Event not found' });
        return;
      }
      res.json({ success: true, data: event });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update event' });
    }
  }
);

/**
 * Admin route - delete an event
 */
router.delete(
  '/admin/events/:id',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      await deleteEvent(req.params.id);
      res.json({ success: true, message: 'Event deleted' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to delete event' });
    }
  }
);

// ==================== GALLERY ====================

/**
 * Public route - get gallery media by category
 */
router.get('/gallery/:category', async (req: Request, res: Response) => {
  try {
    const media = await getGalleryByCategory(req.params.category);
    res.json({ success: true, data: media });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch gallery' });
  }
});

/**
 * Admin route - get all gallery media
 */
router.get(
  '/admin/gallery',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (_req: Request, res: Response) => {
    try {
      const media = await getAllGalleryMedia();
      res.json({ success: true, data: media });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch gallery' });
    }
  }
);

/**
 * Admin route - get gallery media by ID
 */
router.get(
  '/admin/gallery/:id',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const media = await getGalleryMediaById(req.params.id);
      if (!media) {
        res.status(404).json({ success: false, error: 'Media not found' });
        return;
      }
      res.json({ success: true, data: media });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch media' });
    }
  }
);

/**
 * Admin route - upload gallery media
 */
router.post(
  '/admin/gallery',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const media = await createGalleryMedia(req.body);
      res.status(201).json({ success: true, data: media });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to upload media' });
    }
  }
);

/**
 * Admin route - delete gallery media
 */
router.delete(
  '/admin/gallery/:id',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      await deleteGalleryMedia(req.params.id);
      res.json({ success: true, message: 'Media deleted' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to delete media' });
    }
  }
);

export default router;
