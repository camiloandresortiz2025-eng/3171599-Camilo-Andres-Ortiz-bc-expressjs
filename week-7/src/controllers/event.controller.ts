// Como: Conecta las rutas HTTP con el servicio de eventos
// Para: Mantener los handlers livianos — solo parseo, delegación y respuesta
// Impacto: Toda lógica de negocio vive en event.service; aquí solo vive HTTP

import { Request, Response, NextFunction } from 'express';
import * as eventService from '../services/event.service';
import { createEventSchema, updateEventSchema } from '../schemas/event.schema';

export async function getAll(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const events = await eventService.getAll();
    res.status(200).json(events);
  } catch (err) {
    next(err);
  }
}

export async function getById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const event = await eventService.getById(req.params.id);
    res.status(200).json(event);
  } catch (err) {
    next(err);
  }
}

export async function create(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const dto    = createEventSchema.parse(req.body);
    const userId = req.user!.sub; // inyectado por authMiddleware
    const event  = await eventService.create(dto, userId);
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
}

export async function update(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const dto   = updateEventSchema.parse(req.body);
    const event = await eventService.update(req.params.id, dto);
    res.status(200).json(event);
  } catch (err) {
    next(err);
  }
}

export async function remove(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await eventService.remove(req.params.id);
    res.status(204).send(); // 204 No Content — sin body
  } catch (err) {
    next(err);
  }
}
