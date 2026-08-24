/**
 * @file apps/server/src/modules/auth/auth.routes.ts
 * @description Authentication routes for login and user session management.
 */

import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../../db/client.js';
import { users } from '../../db/schema/index.js';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_for_tarcms_development_2026';

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

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, {
      expiresIn: '24h',
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
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const [user] = await db.select().from(users).where(eq(users.id, decoded.userId)).limit(1);

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

export default router;
