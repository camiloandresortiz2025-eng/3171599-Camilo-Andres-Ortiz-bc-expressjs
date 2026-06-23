// Como: Capa HTTP para la entidad principal Event — valida ObjectId y body con Zod, delega al servicio
// Para: Mantener el controlador delgado; la lógica de populate y totalPrice está en repositorio/servicio
// Impacto: El campo 'menu' populado aparece como objeto completo en la respuesta, no como ObjectId

import { Request, Response, NextFunction } from 'express';
import * as service from '../services/events.service';
import { createEventSchema, updateEventSchema, objectIdSchema } from '../schemas/event.schema';

function formatIssues(error: import('zod').ZodError) {
  return error.issues.map((i) => ({ field: i.path.join('.'), message: i.message }));
}

// Como: Lee page y limit de query con valores seguros; totalPages viene calculado desde el repositorio
export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(1, Number(req.query['page']) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query['limit']) || 10));
    const result = await service.getAll(page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Como: Valida el id como ObjectId de 24 hex chars antes de consultar MongoDB
export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = objectIdSchema.safeParse(req.params['id']);
    if (!parsed.success) {
      res.status(400).json({ message: 'ID de evento inválido', issues: formatIssues(parsed.error) });
      return;
    }
    const event = await service.getById(parsed.data);
    res.json({ data: event });
  } catch (err) {
    next(err);
  }
}

// Como: Valida body incluyendo el campo 'menu' como ObjectId antes de crear
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = createEventSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: 'Datos inválidos', issues: formatIssues(result.error) });
      return;
    }
    const event = await service.createEvent(result.data);
    res.status(201).json({ data: event });
  } catch (err) {
    next(err);
  }
}

// Como: updateEventSchema usa .partial() — solo los campos enviados se actualizan
export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsedId = objectIdSchema.safeParse(req.params['id']);
    if (!parsedId.success) {
      res.status(400).json({ message: 'ID de evento inválido', issues: formatIssues(parsedId.error) });
      return;
    }
    const result = updateEventSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: 'Datos inválidos', issues: formatIssues(result.error) });
      return;
    }
    const event = await service.updateEvent(parsedId.data, result.data);
    res.json({ data: event });
  } catch (err) {
    next(err);
  }
}

// Como: Valida el id como ObjectId y responde 204 al eliminar exitosamente
export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = objectIdSchema.safeParse(req.params['id']);
    if (!parsed.success) {
      res.status(400).json({ message: 'ID de evento inválido', issues: formatIssues(parsed.error) });
      return;
    }
    await service.deleteEvent(parsed.data);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
