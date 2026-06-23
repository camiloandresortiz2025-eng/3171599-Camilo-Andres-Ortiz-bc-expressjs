// Como: Middleware de error de 4 parámetros que distingue AppError, ZodError y errores genéricos
// Para: Centralizar las respuestas de error incluyendo los errores específicos de Mongoose ya convertidos
// Impacto: Los repositorios convierten CastError y 11000 en AppError; este handler solo necesita detectar AppError

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Como: ZodError proviene del safeParse en controladores — responde 400 con detalle por campo
  if (err instanceof ZodError) {
    res.status(400).json({
      message: 'Datos de entrada inválidos',
      issues: err.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
    });
    return;
  }

  // Como: AppError contiene el statusCode correcto (400/404/409) ya mapeado desde errores de Mongoose
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  // Como: Error inesperado — loguearlo y ocultar detalles al cliente
  console.error('[ErrorHandler] Error no controlado:', err);
  res.status(500).json({ message: 'Error interno del servidor' });
}
