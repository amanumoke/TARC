/**
 * @file apps/server/src/__tests__/app.test.ts
 * @description Integration tests for foundational Express API endpoints and health checks.
 */

import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../app.js';

describe('Express API Foundation & Health Checks', () => {
  const app = createApp();

  it('responds with 200 OK on /api/health', async () => {
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.service).toBe('tarcms-api');
    expect(response.body.timestamp).toBeDefined();
  });

  it('responds with 200 OK and API metadata on /api/v1', async () => {
    const response = await request(app).get('/api/v1');
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('TARCMS REST API');
    expect(response.body.center).toBe('Tepi Agricultural Research Center');
  });
});
