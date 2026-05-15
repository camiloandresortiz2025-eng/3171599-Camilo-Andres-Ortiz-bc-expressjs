import { Router } from 'express';
import * as store from '../store';
import type { CreateCateringEventDto, UpdateCateringEventDto } from '../types';

export const eventsRouter = Router();

// GET /api/v1/events — Listar todos los eventos
eventsRouter.get('/', (_req, res) => {
  res.json(store.getAll());
});

// GET /api/v1/events/:id — Obtener evento por ID
eventsRouter.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const event = store.getById(id);
  if (!event) {
    res.status(404).json({ error: `Evento con id ${id} no encontrado` });
    return;
  }
  res.json(event);
});

// POST /api/v1/events — Crear nuevo evento
eventsRouter.post('/', (req, res) => {
  const dto = req.body as CreateCateringEventDto;
  const created = store.create(dto);
  res.status(201).json(created);
});

// PUT /api/v1/events/:id — Actualizar evento completo
eventsRouter.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const dto = req.body as UpdateCateringEventDto;
  const updated = store.update(id, dto);
  if (!updated) {
    res.status(404).json({ error: `Evento con id ${id} no encontrado` });
    return;
  }
  res.json(updated);
});

// DELETE /api/v1/events/:id — Eliminar evento
eventsRouter.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const deleted = store.remove(id);
  if (!deleted) {
    res.status(404).json({ error: `Evento con id ${id} no encontrado` });
    return;
  }
  res.status(204).send();
});
