import { Request, Response } from 'express';
import { getDashboardMetrics } from './dashboard.service.js';

export async function handleGetDashboardMetrics(_req: Request, res: Response) {
  try {
    const metrics = await getDashboardMetrics();
    res.json({ success: true, data: metrics });
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'METRICS_ERROR', message: 'Failed to fetch dashboard metrics.' },
    });
  }
}
