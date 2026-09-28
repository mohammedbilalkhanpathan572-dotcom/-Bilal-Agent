import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import apiRouter from './server/src/routes/api';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Body parser for JSON and text payloads
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // API router mounted under /api
  app.use('/api', apiRouter);

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'Bilal AI Agent', timestamp: new Date().toISOString() });
  });

  // Full-Stack React + Vite mounting
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    // In development mode, mount Vite middleware to serve client SPA with lightning fast dev experience
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`===============================================`);
    console.log(`🤖 Bilal AI Agent Core Server running at:`);
    console.log(`👉 http://0.0.0.0:${PORT}`);
    console.log(`===============================================`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
