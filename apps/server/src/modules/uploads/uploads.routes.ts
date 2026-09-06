import { Request, Response, Router } from 'express';
import { authenticateToken } from '../../middleware/auth.js';
import { requireRole } from '../../middleware/rbac.js';
import { uploadImage } from '../../storage/fileStorage.js';

const router = Router();

router.post(
  '/images',
  authenticateToken,
  requireRole('SUPER_ADMIN', 'ADMIN'),
  uploadImage.single('file'),
  (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: { message: 'Please select an image file.' },
      });
      return;
    }

    res.status(201).json({
      success: true,
      data: { url: `/uploads/images/${req.file.filename}` },
    });
  }
);

export default router;
