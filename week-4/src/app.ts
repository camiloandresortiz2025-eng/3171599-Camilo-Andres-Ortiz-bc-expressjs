// Como: Configura la aplicación Express registrando middlewares, rutas y handlers de error en el orden correcto
// Para: Separar la configuración de Express del bootstrap del servidor (puerto, listen)
// Impacto: El orden importa — errorHandler debe ser el ÚLTIMO middleware para capturar errores de toda la cadena

import express from 'express';
import { morganMiddleware } from './config/logger';
import eventsRouter from './routes/events.routes';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// Como: express.json() parsea el cuerpo de los requests; morganMiddleware registra cada petición HTTP
app.use(express.json());
app.use(morganMiddleware);

// Health check — no requiere autenticación ni lógica de negocio
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'catering-api', version: '1.0.0' });
});

// Como: Las rutas de dominio se montan antes de notFound para que este capture solo lo no registrado
app.use('/api/v1/events', eventsRouter);

// Como: notFound debe ir DESPUÉS de todas las rutas para capturar solo las no registradas
app.use(notFound);
// Como: errorHandler SIEMPRE es el último — Express lo detecta por sus exactamente 4 parámetros
app.use(errorHandler);

export default app;
