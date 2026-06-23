// Como: Middleware de error Express con 4 parámetros que distingue AppError de errores genéricos
// Para: Centralizar todas las respuestas de error y loguear solo lo relevante
// Impacto: Los errores de Prisma (P2025, P2002, P2003) llegan ya convertidos en AppError desde el repositorio

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';
import { logger } from '../config/logger';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Como: ZodError ocurre cuando safeParse detecta datos inválidos en el controlador
  if (err instanceof ZodError) {
    res.status(400).json({
      status: 'error',
      message: 'Datos de entrada inválidos',
      issues: err.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
    });
    return;
  }

  // Como: AppError es un error operacional — usa su statusCode configurado y loguea como warning
  if (err instanceof AppError) {
    logger.warn(`[AppError] ${err.statusCode} — ${err.message}`);
    res.status(err.statusCode).json({ status: 'error', message: err.message });
    return;
  }

  // Como: Error inesperado — loguearlo como crítico y ocultar detalles en producción
  logger.error('Error no controlado:', err);
  res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
}
