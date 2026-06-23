// Como: Punto de entrada — conecta al entorno, importa app y llama a listen
// Para: Separar el bootstrap del servidor de la configuración de Express, facilitando tests
// Impacto: La URL y el entorno quedan registrados en los logs al arrancar; SIGTERM cierra limpiamente

import 'dotenv/config';
import { app } from './app';
import { logger } from './config/logger';

const PORT = Number(process.env['PORT']) || 3000;

const server = app.listen(PORT, () => {
  logger.info(`🍽️  Catering API (PostgreSQL) corriendo en http://localhost:${PORT}`);
  logger.info(`📦 Entorno: ${process.env['NODE_ENV'] ?? 'development'}`);
  logger.info('📍 Endpoints: GET|POST /api/v1/events  |  GET|PUT|DELETE /api/v1/events/:id');
});

// Como: Cierre limpio para no perder conexiones de Prisma ni requests en vuelo
process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));
