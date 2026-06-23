// Como: Registra los 5 endpoints CRUD del recurso Event en un Router Express independiente
// Para: Organizar las rutas del dominio catering en un módulo montable en app.ts
// Impacto: Agregar un nuevo recurso (menus, bookings) solo requiere crear un router nuevo y montarlo en app.ts

import { Router } from 'express';
import * as controller from '../controllers/events.controller';

const router = Router();

router.get('/', controller.getAll);       // GET    /api/v1/events        - Listar con paginación
router.get('/:id', controller.getById);   // GET    /api/v1/events/:id    - Obtener por id
router.post('/', controller.create);      // POST   /api/v1/events        - Crear evento
router.put('/:id', controller.update);    // PUT    /api/v1/events/:id    - Actualizar evento
router.delete('/:id', controller.remove); // DELETE /api/v1/events/:id    - Eliminar evento

export default router;
