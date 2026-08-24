import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';
import { handleGetDashboardMetrics } from './dashboard.controller.js';

const router = Router();

router.get(
  '/metrics',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN', 'RESEARCHER', 'STAFF'),
  handleGetDashboardMetrics
);

export default router;
