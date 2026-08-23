/**
 * @file apps/server/src/server.ts
 * @description HTTP Server entry point. Binds the Express application to the configured PORT.
 */

import { createApp } from './app.js';

const app = createApp();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 TARCMS API Server running on port ${PORT}`);
  console.log(`🌱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/api/health`);
  console.log('====================================================');
});
