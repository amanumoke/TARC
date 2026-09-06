import { randomUUID } from 'node:crypto';
import { Request, Response, Router } from 'express';
import { authenticateToken } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';
import {
  createVacancy,
  deleteVacancy,
  getAllVacancies,
  getPublicVacancies,
  getVacancyById,
  updateVacancy,
} from './vacancies.service.js';

const router = Router();
const adminAccess = [authenticateToken, requireRole('SUPER_ADMIN', 'ADMIN')];

router.get('/', async (_req: Request, res: Response) => {
  try {
    res.json({ success: true, data: await getPublicVacancies() });
  } catch {
    res.status(500).json({ success: false, error: { message: 'Failed to fetch vacancies' } });
  }
});

router.get('/admin', ...adminAccess, async (_req: Request, res: Response) => {
  try {
    res.json({ success: true, data: await getAllVacancies() });
  } catch {
    res.status(500).json({ success: false, error: { message: 'Failed to fetch vacancies' } });
  }
});

router.post('/admin', ...adminAccess, async (req: Request, res: Response) => {
  try {
    const vacancy = await createVacancy({ id: randomUUID(), ...req.body });
    res.status(201).json({ success: true, data: vacancy });
  } catch {
    res.status(400).json({ success: false, error: { message: 'Failed to create vacancy' } });
  }
});

router.patch('/admin/:id', ...adminAccess, async (req: Request, res: Response) => {
  try {
    const vacancy = await updateVacancy(req.params.id, req.body);
    if (!vacancy) {
      res.status(404).json({ success: false, error: { message: 'Vacancy not found' } });
      return;
    }
    res.json({ success: true, data: vacancy });
  } catch {
    res.status(400).json({ success: false, error: { message: 'Failed to update vacancy' } });
  }
});

router.delete('/admin/:id', ...adminAccess, async (req: Request, res: Response) => {
  try {
    await deleteVacancy(req.params.id);
    res.json({ success: true, data: null });
  } catch {
    res.status(500).json({ success: false, error: { message: 'Failed to delete vacancy' } });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const vacancy = await getVacancyById(req.params.id);
    if (!vacancy || !vacancy.isPublished) {
      res.status(404).json({ success: false, error: { message: 'Vacancy not found' } });
      return;
    }
    res.json({ success: true, data: vacancy });
  } catch {
    res.status(500).json({ success: false, error: { message: 'Failed to fetch vacancy' } });
  }
});

export default router;
