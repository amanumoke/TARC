/**
 * @file apps/server/src/modules/publications/publications.routes.ts
 * @description Express route definitions for publications endpoints.
 * Includes public and admin routes with RBAC protection.
 */

import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';
import {
  handleCreatePublication,
  handleDeletePublication,
  handleGetAdminPublications,
  handleGetPublicPublications,
  handleGetPublicationById,
} from './publications.controller.js';

const router = Router();

/**
 * Public route - get featured publications
 */
router.get('/', handleGetPublicPublications);

/**
 * Admin route - get all publications
 */
router.get(
  '/admin',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  handleGetAdminPublications
);

/**
 * Admin route - get publication by ID
 */
router.get(
  '/admin/:id',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  handleGetPublicationById
);

/**
 * Admin route - create a new publication with authors
 */
router.post(
  '/admin',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  handleCreatePublication
);

/**
 * Admin route - delete a publication
 */
router.delete(
  '/admin/:id',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  handleDeletePublication
);

export default router;
