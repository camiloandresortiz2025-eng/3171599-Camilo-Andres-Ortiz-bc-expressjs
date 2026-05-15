import app from './app';

const PORT = parseInt(process.env['PORT'] ?? '3000', 10);

app.listen(PORT, () => {
  console.log(`🍽️  Catering Elite API corriendo en http://localhost:${PORT}`);
  console.log(`   Health : http://localhost:${PORT}/health`);
  console.log(`   Eventos: http://localhost:${PORT}/api/v1/events`);
  console.log(`   Con paginación: http://localhost:${PORT}/api/v1/events?page=1&limit=5`);
});
