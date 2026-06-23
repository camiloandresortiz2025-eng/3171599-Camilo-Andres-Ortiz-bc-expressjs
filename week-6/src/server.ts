// Como: Punto de entrada — conecta a MongoDB con connectDB() ANTES de iniciar el servidor HTTP
// Para: Garantizar que la API no acepte requests antes de que la conexión a MongoDB esté lista
// Impacto: Si MongoDB no está disponible, el proceso termina con código 1 y mensaje de error claro

import 'dotenv/config';
import { app } from './app';
import { connectDB } from './lib/mongoose';

const PORT = process.env['PORT'] ?? '3000';

async function main(): Promise<void> {
  // Como: connectDB primero — si falla, el catch termina el proceso sin iniciar el servidor
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🍽️  Catering API (MongoDB) corriendo en http://localhost:${PORT}`);
    console.log(`📦 Entorno: ${process.env['NODE_ENV'] ?? 'development'}`);
    console.log('📍 Endpoints: /api/v1/menus | /api/v1/events');
  });
}

main().catch((err: unknown) => {
  console.error('❌ Error al iniciar el servidor:', err);
  process.exit(1);
});
