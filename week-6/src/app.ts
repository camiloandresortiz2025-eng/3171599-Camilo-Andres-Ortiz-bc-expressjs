// Como: Configura Express montando los dos routers del dominio catering y los handlers de error
// Para: Organizar el punto central de configuración de la API con las dos entidades relacionadas
// Impacto: Agregar nuevas entidades (bookings, staff) solo requiere crear un router y montarlo aquí

import express from 'express';
import menusRouter from './routes/menus.routes';
import eventsRouter from './routes/events.routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';

export const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'catering-api-mongo', version: '3.0.0' });
});

// Como: La entidad secundaria (menus) se monta antes de la principal (events) por convención
app.use('/api/v1/menus', menusRouter);
app.use('/api/v1/events', eventsRouter);

// Como: notFound y errorHandler deben ir al final — en ese orden
app.use(notFound);
app.use(errorHandler);
