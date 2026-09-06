/**
 * @file apps/server/src/modules/auth/auth.routes.ts
 * @description Authentication routes for login and user session management.
 */

import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { Request, Response, Router } from 'express';
import { db } from '../../db/client.js';
import { users } from '../../db/schema/index.js';
import { authenticateToken, AuthenticatedRequest } from '../../middleware/auth.js';
import { generateToken, hashPassword, verifyToken } from '../../utils/security.js';

const router = Router();

/**
 * POST /api/v1/auth/login
 * Authenticate user with email and password, returns JWT token and user info.
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: { code: 'MISSING_FIELDS', message: 'Email and password are required' },
      });
      return;
    }

    // Find user by email
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!user) {
      res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
      });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(403).json({
        success: false,
        error: { code: 'ACCOUNT_DISABLED', message: 'Account is disabled' },
      });
      return;
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
      });
      return;
    }

    // Generate JWT token using the shared security contract
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Return user info (excluding password hash)
    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatarUrl: user.avatarUrl,
        },
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'An error occurred during login' },
    });
  }
});

/**
 * GET /api/v1/auth/me
 * Get current authenticated user info.
 */
router.get('/me', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'No token provided' },
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    const [user] = await db.select().from(users).where(eq(users.id, decoded.id)).limit(1);

    if (!user) {
      res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'User not found' },
      });
      return;
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' },
    });
  }
});

router.patch('/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const name = String(req.body.name || '').trim();
    const email = String(req.body.email || '').trim().toLowerCase();
    if (!req.user || !name || !email) {
      res.status(400).json({ success: false, error: { message: 'Name and email are required' } });
      return;
    }
    await db.update(users).set({ name, email }).where(eq(users.id, req.user.id));
    const [updated] = await db.select().from(users).where(eq(users.id, req.user.id)).limit(1);
    res.json({ success: true, data: { id: updated.id, name: updated.name, email: updated.email, role: updated.role, avatarUrl: updated.avatarUrl } });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to update profile' } });
  }
});

router.post('/profile/password', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!req.user || !currentPassword || !newPassword || String(newPassword).length < 8) {
      res.status(400).json({ success: false, error: { message: 'Valid current and new passwords are required' } });
      return;
    }
    const [user] = await db.select().from(users).where(eq(users.id, req.user.id)).limit(1);
    if (!user || !(await bcrypt.compare(currentPassword, user.passwordHash))) {
      res.status(400).json({ success: false, error: { message: 'Current password is incorrect' } });
      return;
    }
    await db.update(users).set({ passwordHash: await hashPassword(newPassword) }).where(eq(users.id, req.user.id));
    res.json({ success: true, data: { message: 'Password changed successfully' } });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Failed to change password' } });
  }
});

export default router;
