// Como: Registra los 5 endpoints CRUD de la entidad principal Event
// Para: Organizar las rutas de eventos en un Router independiente montable en app.ts
// Impacto: La respuesta de eventos incluye el menú populado automáticamente via populate()

import { Router } from 'express';
import * as ctrl from '../controllers/events.controller';

const router = Router();

router.get('/', ctrl.getAll);        // GET    /api/v1/events
router.get('/:id', ctrl.getById);    // GET    /api/v1/events/:id
router.post('/', ctrl.create);       // POST   /api/v1/events
router.put('/:id', ctrl.update);     // PUT    /api/v1/events/:id
router.delete('/:id', ctrl.remove);  // DELETE /api/v1/events/:id

export default router;
