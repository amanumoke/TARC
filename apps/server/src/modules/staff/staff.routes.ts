/**
 * @file apps/server/src/modules/staff/staff.routes.ts
 * @description Express route definitions for staff personnel endpoints.
 * Includes both public directory and admin CRUD routes with RBAC protection.
 */

import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';
import {
  handleCreateStaff,
  handleDeleteStaff,
  handleGetAdminStaff,
  handleGetPublicStaff,
  handleGetStaffById,
  handleUpdateStaff,
} from './staff.controller.js';

const router = Router();

/**
 * Public routes - no authentication required
 * Used by the public website to display staff directory
 */
router.get('/', handleGetPublicStaff);

/**
 * Admin routes - require authentication and role authorization
 * Used by the dashboard for staff management
 */
router.get('/admin', authenticateToken, requireRole('SUPER_ADMIN', 'ADMIN'), handleGetAdminStaff);

router.get(
  '/admin/:id',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  handleGetStaffById
);

router.post('/admin', authenticateToken, requireRole('SUPER_ADMIN', 'ADMIN'), handleCreateStaff);

router.put('/admin/:id', authenticateToken, requireRole('SUPER_ADMIN', 'ADMIN'), handleUpdateStaff);

router.delete(
  '/admin/:id',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  handleDeleteStaff
);

export default router;
