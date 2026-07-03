import 'dotenv/config';
import { app } from './app';
import { connectDB } from './lib/mongoose';

const PORT = Number(process.env.PORT) || 3000;

async function main(): Promise<void> {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Catering Elite API corriendo en http://localhost:${PORT}`);
    console.log(`Docs rápidos:`);
    console.log(`  POST /api/v1/auth/register`);
    console.log(`  POST /api/v1/auth/login`);
    console.log(`  GET  /api/v1/auth/me        (requiere cookie)`);
    console.log(`  GET  /api/v1/events          (requiere cookie)`);
  });
}

main().catch((err) => {
  console.error('Error fatal al iniciar:', err);
  process.exit(1);
});
