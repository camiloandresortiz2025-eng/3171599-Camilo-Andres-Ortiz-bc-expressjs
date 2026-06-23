// Como: Capa HTTP para la entidad secundaria Menu — valida entrada con Zod y delega al servicio
// Para: Mantener separación de responsabilidades también en la entidad secundaria del dominio
// Impacto: Los errores de Mongoose (CastError, 11000) llegan convertidos como AppError al errorHandler

import { Request, Response, NextFunction } from 'express';
import * as service from '../services/menus.service';
import { createMenuSchema, updateMenuSchema } from '../schemas/menu.schema';
import { objectIdSchema } from '../schemas/event.schema';

function formatIssues(error: import('zod').ZodError) {
  return error.issues.map((i) => ({ field: i.path.join('.'), message: i.message }));
}

// Como: Retorna todos los menús ordenados por nombre sin paginación (catálogo pequeño)
export async function getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const menus = await service.getAll();
    res.json({ data: menus });
  } catch (err) {
    next(err);
  }
}

// Como: Valida el id como ObjectId antes de consultar MongoDB para evitar CastError innecesarios
export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = objectIdSchema.safeParse(req.params['id']);
    if (!parsed.success) {
      res.status(400).json({ message: 'ID de menú inválido', issues: formatIssues(parsed.error) });
      return;
    }
    const menu = await service.getById(parsed.data);
    res.json({ data: menu });
  } catch (err) {
    next(err);
  }
}

// Como: Valida el body con createMenuSchema — responde 400 con campo específico si hay error
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const result = createMenuSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: 'Datos inválidos', issues: formatIssues(result.error) });
      return;
    }
    const menu = await service.createMenu(result.data);
    res.status(201).json({ data: menu });
  } catch (err) {
    next(err);
  }
}

// Como: Valida id y body con schemas Zod antes de actualizar
export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsedId = objectIdSchema.safeParse(req.params['id']);
    if (!parsedId.success) {
      res.status(400).json({ message: 'ID de menú inválido', issues: formatIssues(parsedId.error) });
      return;
    }
    const result = updateMenuSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ message: 'Datos inválidos', issues: formatIssues(result.error) });
      return;
    }
    const menu = await service.updateMenu(parsedId.data, result.data);
    res.json({ data: menu });
  } catch (err) {
    next(err);
  }
}

// Como: Valida el id y responde 204 sin cuerpo al eliminar exitosamente
export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = objectIdSchema.safeParse(req.params['id']);
    if (!parsed.success) {
      res.status(400).json({ message: 'ID de menú inválido', issues: formatIssues(parsed.error) });
      return;
    }
    await service.deleteMenu(parsed.data);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
