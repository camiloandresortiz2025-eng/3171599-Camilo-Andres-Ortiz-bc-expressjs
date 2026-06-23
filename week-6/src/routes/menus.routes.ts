// Como: Registra los 5 endpoints CRUD de la entidad secundaria Menu
// Para: Organizar las rutas de menús en un Router independiente montable en app.ts
// Impacto: Los clientes pueden gestionar el catálogo de menús antes de crear eventos

import { Router } from 'express';
import * as ctrl from '../controllers/menus.controller';

const router = Router();

router.get('/', ctrl.getAll);        // GET    /api/v1/menus
router.get('/:id', ctrl.getById);    // GET    /api/v1/menus/:id
router.post('/', ctrl.create);       // POST   /api/v1/menus
router.put('/:id', ctrl.update);     // PUT    /api/v1/menus/:id
router.delete('/:id', ctrl.remove);  // DELETE /api/v1/menus/:id

export default router;
