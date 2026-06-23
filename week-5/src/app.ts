// Como: Configura Express registrando middlewares, routers y handlers de error en el orden correcto
// Para: Separar la configuración de Express del bootstrap del servidor (puerto, listen)
// Impacto: El orden importa — notFound y errorHandler deben ir al final para capturar todo lo anterior

import express from 'express';
import { morganMiddleware } from './config/logger';
import eventsRouter from './routes/events.routes';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morganMiddleware);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'catering-api-postgres', version: '2.0.0' });
});

// Como: Las rutas del dominio se registran antes de notFound para que este capture solo las no registradas
app.use('/api/v1/events', eventsRouter);

app.use(notFound);
app.use(errorHandler);

export { app };
