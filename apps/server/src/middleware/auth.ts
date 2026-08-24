import { NextFunction, Request, Response } from 'express';
import { AuthTokenPayload, verifyToken } from '../utils/security.js';

export interface AuthenticatedRequest extends Request {
  user?: AuthTokenPayload;
}

export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Access token required.' } });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Token is invalid or expired.' },
    });
  }
}
