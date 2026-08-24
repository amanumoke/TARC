/**
 * @file apps/server/src/app.ts
 * @description Express application setup, global middleware, health checks,
 * and routing configuration for the TARCMS REST API.
 */

import cors from 'cors';
import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import communicationRoutes from './modules/communication/communication.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import departmentsRoutes from './modules/departments/departments.routes.js';
import publicationsRoutes from './modules/publications/publications.routes.js';
import researchRoutes from './modules/research/research.routes.js';
import staffRoutes from './modules/staff/staff.routes.js';

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

  // 6. Admin Dashboard Routes
  app.use('/api/v1/admin/dashboard', dashboardRoutes);

  // 7. Departments Routes
  app.use('/api/v1/departments', departmentsRoutes);
  app.use('/api/v1/admin/departments', departmentsRoutes);

  // 8. Staff Routes
  app.use('/api/v1/staff', staffRoutes);
  app.use('/api/v1/admin/staff', staffRoutes);

  // 9. Research Routes (Programs & Projects)
  app.use('/api/v1/research', researchRoutes);
  app.use('/api/v1/admin/research', researchRoutes);

  // 10. Publications Routes
  app.use('/api/v1/publications', publicationsRoutes);
  app.use('/api/v1/admin/publications', publicationsRoutes);

  // 11. Communication Routes (News, Events, Gallery)
  app.use('/api/v1/communication', communicationRoutes);
  app.use('/api/v1/admin/communication', communicationRoutes);

  return app;
}
