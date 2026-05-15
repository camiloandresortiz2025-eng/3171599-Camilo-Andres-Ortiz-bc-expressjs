import { Request, Response, NextFunction } from 'express';
import * as service from '../services/events.service';
import { CreateCateringEventDto, UpdateCateringEventDto, ErrorResponse } from '../types';

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page  = Math.max(1, parseInt(String(req.query['page']  ?? '1'),  10) || 1);
    const limit = Math.max(1, parseInt(String(req.query['limit'] ?? '10'), 10) || 10);
    const result = await service.findAll({ page, limit });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(String(req.params['id'] ?? ''), 10);
    const event = await service.findById(id);
    if (!event) {
      const body: ErrorResponse = { error: 'Not Found', message: `Evento ${id} no encontrado` };
      res.status(404).json(body);
      return;
    }
    res.json({ data: event });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = req.body as CreateCateringEventDto;
    const event = await service.create(dto);
    res.status(201).json({ data: event });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id  = parseInt(String(req.params['id'] ?? ''), 10);
    const dto = req.body as UpdateCateringEventDto;
    const updated = await service.update(id, dto);
    if (!updated) {
      const body: ErrorResponse = { error: 'Not Found', message: `Evento ${id} no encontrado` };
      res.status(404).json(body);
      return;
    }
    res.json({ data: updated });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(String(req.params['id'] ?? ''), 10);
    const deleted = await service.remove(id);
    if (!deleted) {
      const body: ErrorResponse = { error: 'Not Found', message: `Evento ${id} no encontrado` };
      res.status(404).json(body);
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
