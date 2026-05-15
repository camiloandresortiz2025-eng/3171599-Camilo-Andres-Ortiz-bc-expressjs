import express from 'express';
import type { Application, Request, Response, NextFunction } from 'express';
import { eventsRouter } from './routes/events.routes';

export function createApp(): Application {
  const app = express();

  // 1. Parseo de body JSON
  app.use(express.json());

  // 2. Logger personalizado — método, URL, status y tiempo de respuesta
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
      const ms = Date.now() - start;
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} — ${ms}ms`);
    });
    next();
  });

  // 3. Health check
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'Catering Elite API', timestamp: new Date().toISOString() });
  });

  // 4. Rutas del dominio
  app.use('/api/v1/events', eventsRouter);

  // 5. Handler 404 — rutas no encontradas
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
  });

  // 6. Error handler global — siempre el último
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(`[ERROR] ${err.message}`);
    res.status(500).json({ error: 'Error interno del servidor', message: err.message });
  });

  return app;
}
