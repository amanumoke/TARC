/**
 * @file apps/server/src/modules/publications/publications.controller.ts
 * @description HTTP request handlers for publications endpoints.
 */

import { Request, Response } from 'express';
import {
  createPublicationWithAuthors,
  deletePublication,
  getAllPublications,
  getFeaturedPublications,
  getPublicationById,
} from './publications.service.js';

/**
 * Handles GET /api/v1/public/publications
 * Returns featured publications for the public portal.
 */
export async function handleGetPublicPublications(_req: Request, res: Response) {
  try {
    const publications = await getFeaturedPublications();
    res.json({ success: true, data: publications });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch publications' });
  }
}

/**
 * Handles GET /api/v1/admin/publications
 * Returns all publications for admin management.
 */
export async function handleGetAdminPublications(_req: Request, res: Response) {
  try {
    const publications = await getAllPublications();
    res.json({ success: true, data: publications });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch publications' });
  }
}

/**
 * Handles GET /api/v1/admin/publications/:id
 * Returns a single publication with authors.
 */
export async function handleGetPublicationById(req: Request, res: Response) {
  try {
    const publication = await getPublicationById(req.params.id);
    if (!publication) {
      res.status(404).json({ success: false, error: 'Publication not found' });
      return;
    }
    res.json({ success: true, data: publication });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch publication' });
  }
}

/**
 * Handles POST /api/v1/admin/publications
 * Creates a new publication with authors.
 */
export async function handleCreatePublication(req: Request, res: Response) {
  try {
    const publication = await createPublicationWithAuthors(req.body);
    res.status(201).json({ success: true, data: publication });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create publication' });
  }
}

/**
 * Handles DELETE /api/v1/admin/publications/:id
 * Deletes a publication and its authors.
 */
export async function handleDeletePublication(req: Request, res: Response) {
  try {
    await deletePublication(req.params.id);
    res.json({ success: true, message: 'Publication deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete publication' });
  }
}
