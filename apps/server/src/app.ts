/**
 * @file apps/server/src/app.ts
 * @description Express application setup, global middleware, health checks,
 * and routing configuration for the TARCMS REST API.
 */

import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';

/**
 * Creates and configures the Express application instance.
 */
export function createApp(): Express {
  const app = express();

  // 1. Security Headers
  app.use(helmet());

  // 2. Cross-Origin Resource Sharing (CORS)
  app.use(
    cors({
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true,
    })
  );

  // 3. Body Parsing Middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 4. Base Health Check Endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'tarcms-api',
      timestamp: new Date().toISOString(),
      uptimeSeconds: process.uptime(),
    });
  });

  // 5. API v1 Root Info Endpoint
  app.get('/api/v1', (_req: Request, res: Response) => {
    res.json({
      name: 'TARCMS REST API',
      version: '1.0.0',
      center: 'Tepi Agricultural Research Center',
      docsUrl: '/api/v1/docs',
    });
  });

  return app;
}
