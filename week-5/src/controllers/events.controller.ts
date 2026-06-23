// Como: Capa HTTP delgada que valida entrada con Zod, llama al servicio y envía la respuesta
// Para: Separar el protocolo HTTP de la lógica de negocio y el acceso a datos
// Impacto: Cada error pasa por next(err) y llega al errorHandler centralizado con el código correcto

import { Request, Response, NextFunction } from 'express';
import * as service from '../services/events.service';
import { createEventSchema, updateEventSchema } from '../schemas/event.schema';

// Como: Valida que el parámetro :id sea un entero positivo
function parseId(raw: string): number | null {
  const n = parseInt(raw, 10);
  return Number.isInteger(n) && n > 0 ? n : null;
}

function formatIssues(error: import('zod').ZodError) {
  return error.issues.map((i) => ({ field: i.path.join('.') || 'body', message: i.message }));
}

// Como: Lee page y limit de query con límites seguros y llama service.listEvents
export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(1, Number(req.query['page']) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query['limit']) || 10));
    const result = await service.listEvents(page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Como: Valida el id y llama service.getEvent — AppError 404 llega al errorHandler si no existe
export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseId(req.params['id'] ?? '');
    if (!id) {
      res.status(400).json({ status: 'error', message: 'El id debe ser un entero positivo' });
      return;
    }
    const event = await service.getEvent(id);
    res.json({ data: event });
  } catch (err) {
    next(err);
  }
}

// Como: Valida body con createEventSchema.safeParse — responde 400 con issues si falla
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = createEventSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ status: 'error', message: 'Datos inválidos', issues: formatIssues(result.error) });
      return;
    }
    const event = await service.createEvent(result.data);
    res.status(201).json({ data: event });
  } catch (err) {
    next(err);
  }
}

// Como: Valida id y body antes de actualizar; updateEventSchema usa .partial() para campos opcionales
export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseId(req.params['id'] ?? '');
    if (!id) {
      res.status(400).json({ status: 'error', message: 'El id debe ser un entero positivo' });
      return;
    }
    const result = updateEventSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ status: 'error', message: 'Datos inválidos', issues: formatIssues(result.error) });
      return;
    }
    const event = await service.updateEvent(id, result.data);
    res.json({ data: event });
  } catch (err) {
    next(err);
  }
}

// Como: Valida el id y responde 204 sin cuerpo al eliminar exitosamente
export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseId(req.params['id'] ?? '');
    if (!id) {
      res.status(400).json({ status: 'error', message: 'El id debe ser un entero positivo' });
      return;
    }
    await service.deleteEvent(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
