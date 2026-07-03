// Como: Declara las 5 rutas CRUD de eventos, todas protegidas con authMiddleware
// Para: Garantizar que solo usuarios autenticados puedan gestionar eventos de catering
// Impacto: Sin cookie válida, cualquier request a /api/v1/events retorna 401

import { Router } from 'express';
import * as eventController from '../controllers/event.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Como: router.use(authMiddleware) aplica auth a todas las rutas del router
// Para: No repetir el middleware en cada ruta individualmente
router.use(authMiddleware);

// GET  /api/v1/events       — listar todos los eventos (ordenados por fecha)
router.get('/',    eventController.getAll);

// GET  /api/v1/events/:id   — obtener un evento por ID
router.get('/:id', eventController.getById);

// POST /api/v1/events       — crear un nuevo evento (requiere body válido)
router.post('/',   eventController.create);

// PATCH /api/v1/events/:id  — actualización parcial de un evento
router.patch('/:id', eventController.update);

// DELETE /api/v1/events/:id — eliminar un evento (responde 204)
router.delete('/:id', eventController.remove);

export default router;
