import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // ZodError de Zod v4 tiene propiedad 'issues'
  if ((err as { issues?: unknown }).issues) {
    res.status(400).json({ error: 'Datos de entrada inválidos', details: err.message });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
}
