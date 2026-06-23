// Como: Registra los 5 endpoints CRUD del recurso Event en un Router Express independiente
// Para: Modularizar las rutas de eventos separándolas de la configuración principal de la app
// Impacto: Agregar rutas de menús o bookings solo requiere crear un router nuevo y montarlo en app.ts

import { Router } from 'express';
import * as ctrl from '../controllers/events.controller';

const router = Router();

router.get('/', ctrl.getAll);       // GET    /api/v1/events
router.get('/:id', ctrl.getById);   // GET    /api/v1/events/:id
router.post('/', ctrl.create);      // POST   /api/v1/events
router.put('/:id', ctrl.update);    // PUT    /api/v1/events/:id
router.delete('/:id', ctrl.remove); // DELETE /api/v1/events/:id

export default router;
