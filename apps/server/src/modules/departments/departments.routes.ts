/**
 * @file apps/server/src/modules/departments/departments.routes.ts
 * @description Express route definitions for department endpoints.
 * Includes both public discovery and admin CRUD routes with RBAC protection.
 */

import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';
import {
  handleCreateDepartment,
  handleDeleteDepartment,
  handleGetAdminDepartments,
  handleGetDepartmentById,
  handleGetPublicDepartments,
  handleUpdateDepartment,
} from './departments.controller.js';

const router = Router();

/**
 * Public routes - no authentication required
 * Used by the public website to display department listings
 */
router.get('/', handleGetPublicDepartments);

/**
 * Admin routes - require authentication and role authorization
 * Used by the dashboard for department management
 */
router.get(
  '/admin',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  handleGetAdminDepartments
);

router.get(
  '/admin/:id',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  handleGetDepartmentById
);

router.post(
  '/admin',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  handleCreateDepartment
);

router.put(
  '/admin/:id',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  handleUpdateDepartment
);

router.delete(
  '/admin/:id',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  handleDeleteDepartment
);

export default router;
