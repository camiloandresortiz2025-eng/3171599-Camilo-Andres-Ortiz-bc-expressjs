// Como: Punto de entrada — importa app, lee el puerto del entorno y llama a listen
// Para: Separar el bootstrap del servidor de la configuración de Express, facilitando tests unitarios
// Impacto: La URL y el entorno quedan registrados en los logs al arrancar, visibles en cualquier despliegue

import 'dotenv/config';
import app from './app';
import { logger } from './config/logger';

const PORT = process.env['PORT'] ? Number(process.env['PORT']) : 3000;

app.listen(PORT, () => {
  logger.info(`🍽️  Catering API corriendo en http://localhost:${PORT}`);
  logger.info(`📦 Entorno: ${process.env['NODE_ENV'] ?? 'development'}`);
  logger.info('📍 Endpoints: GET|POST /api/v1/events  |  GET|PUT|DELETE /api/v1/events/:id');
});
