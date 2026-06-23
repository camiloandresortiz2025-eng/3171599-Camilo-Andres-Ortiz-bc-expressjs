// Como: Capa HTTP delgada que valida entrada con Zod, llama al servicio y envía la respuesta al cliente
// Para: Separar el protocolo HTTP de la lógica de negocio — el controlador no conoce cómo se almacenan los datos
// Impacto: Cada error pasa a next(err) y el errorHandler centralizado lo convierte en la respuesta correcta

import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as service from '../services/events.service';
import { createEventSchema, updateEventSchema, CreateEventDto, UpdateEventDto } from '../schemas/event.schema';
import { SingleResponse, PaginatedResponse, Event } from '../types';

// Como: Valida que el parámetro :id sea un entero positivo antes de pasar al servicio
const idSchema = z.coerce.number().int().positive({ message: 'El id debe ser un entero positivo' });

function formatIssues(error: z.ZodError): Array<{ field: string; message: string }> {
  return error.issues.map((issue) => ({
    field: issue.path.join('.') || 'id',
    message: issue.message,
  }));
}

// Como: Lee page y limit de query params con valores por defecto seguros
export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(1, Number(req.query['page']) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query['limit']) || 10));
    const result = await service.findAll({ page, limit });
    res.json(result satisfies PaginatedResponse<Event>);
  } catch (err) {
    next(err);
  }
}

// Como: Valida el id con safeParse — responde 400 con issues si es inválido antes de ir al servicio
export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = idSchema.safeParse(req.params['id']);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation Error', message: 'ID inválido', issues: formatIssues(parsed.error) });
      return;
    }
    const event = await service.findById(parsed.data);
    res.json({ data: event } satisfies SingleResponse<Event>);
  } catch (err) {
    next(err);
  }
}

// Como: Valida el body con createEventSchema antes de crear — responde 400 con campo específico si falla
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = createEventSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: 'Validation Error', message: 'Datos de entrada inválidos', issues: formatIssues(result.error) });
      return;
    }
    const dto: CreateEventDto = result.data;
    const event = await service.create(dto);
    res.status(201).json({ data: event } satisfies SingleResponse<Event>);
  } catch (err) {
    next(err);
  }
}

// Como: Valida tanto el id como el body antes de actualizar — updateEventSchema usa .partial() para campos opcionales
export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsedId = idSchema.safeParse(req.params['id']);
    if (!parsedId.success) {
      res.status(400).json({ error: 'Validation Error', message: 'ID inválido', issues: formatIssues(parsedId.error) });
      return;
    }
    const result = updateEventSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: 'Validation Error', message: 'Datos de entrada inválidos', issues: formatIssues(result.error) });
      return;
    }
    const dto: UpdateEventDto = result.data;
    const event = await service.update(parsedId.data, dto);
    res.json({ data: event } satisfies SingleResponse<Event>);
  } catch (err) {
    next(err);
  }
}

// Como: Valida el id y responde 204 sin cuerpo al eliminar exitosamente
export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = idSchema.safeParse(req.params['id']);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation Error', message: 'ID inválido', issues: formatIssues(parsed.error) });
      return;
    }
    await service.remove(parsed.data);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
