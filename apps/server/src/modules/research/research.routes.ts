/**
 * @file apps/server/src/modules/research/research.routes.ts
 * @description Express route definitions for research programs and projects.
 * Includes both public and admin routes with RBAC protection.
 */

import { Request, Response, Router } from 'express';
import { authenticateToken } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';
import {
  createProgram,
  deleteProgram,
  getActivePrograms,
  getAllPrograms,
  getProgramById,
  updateProgram,
} from './programs.service.js';
import {
  createProject,
  deleteProject,
  getActiveProjects,
  getAllProjects,
  getProjectById,
  updateProject,
} from './projects.service.js';

const router = Router();

// ==================== PROGRAMS ====================

/**
 * Public route - get active programs
 */
router.get('/programs', async (_req: Request, res: Response) => {
  try {
    const programs = await getActivePrograms();
    res.json({ success: true, data: programs });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch programs' });
  }
});

/**
 * Admin route - get all programs
 */
router.get(
  '/admin/programs',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (_req: Request, res: Response) => {
    try {
      const programs = await getAllPrograms();
      res.json({ success: true, data: programs });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch programs' });
    }
  }
);

/**
 * Admin route - get program by ID
 */
router.get(
  '/admin/programs/:id',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const program = await getProgramById(req.params.id);
      if (!program) {
        res.status(404).json({ success: false, error: 'Program not found' });
        return;
      }
      res.json({ success: true, data: program });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch program' });
    }
  }
);

/**
 * Admin route - create a new program
 */
router.post(
  '/admin/programs',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const program = await createProgram(req.body);
      res.status(201).json({ success: true, data: program });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to create program' });
    }
  }
);

/**
 * Admin route - update a program
 */
router.put(
  '/admin/programs/:id',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const program = await updateProgram(req.params.id, req.body);
      if (!program) {
        res.status(404).json({ success: false, error: 'Program not found' });
        return;
      }
      res.json({ success: true, data: program });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update program' });
    }
  }
);

/**
 * Admin route - delete a program
 */
router.delete(
  '/admin/programs/:id',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      await deleteProgram(req.params.id);
      res.json({ success: true, message: 'Program deleted' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to delete program' });
    }
  }
);

// ==================== PROJECTS ====================

/**
 * Public route - get active projects
 */
router.get('/projects', async (_req: Request, res: Response) => {
  try {
    const projects = await getActiveProjects();
    res.json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch projects' });
  }
});

/**
 * Admin route - get all projects
 */
router.get(
  '/admin/projects',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (_req: Request, res: Response) => {
    try {
      const projects = await getAllProjects();
      res.json({ success: true, data: projects });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch projects' });
    }
  }
);

/**
 * Admin route - get project by ID
 */
router.get(
  '/admin/projects/:id',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const project = await getProjectById(req.params.id);
      if (!project) {
        res.status(404).json({ success: false, error: 'Project not found' });
        return;
      }
      res.json({ success: true, data: project });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to fetch project' });
    }
  }
);

/**
 * Admin route - create a new project
 */
router.post(
  '/admin/projects',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const project = await createProject(req.body);
      res.status(201).json({ success: true, data: project });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to create project' });
    }
  }
);

/**
 * Admin route - update a project
 */
router.put(
  '/admin/projects/:id',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      const project = await updateProject(req.params.id, req.body);
      if (!project) {
        res.status(404).json({ success: false, error: 'Project not found' });
        return;
      }
      res.json({ success: true, data: project });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to update project' });
    }
  }
);

/**
 * Admin route - delete a project
 */
router.delete(
  '/admin/projects/:id',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  async (req: Request, res: Response) => {
    try {
      await deleteProject(req.params.id);
      res.json({ success: true, message: 'Project deleted' });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Failed to delete project' });
    }
  }
);

export default router;
