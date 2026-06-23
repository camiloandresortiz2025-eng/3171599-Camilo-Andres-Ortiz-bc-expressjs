// Como: Middleware de error Express con exactamente 4 parámetros que clasifica ZodError, AppError y errores genéricos
// Para: Centralizar todas las respuestas de error eliminando código repetido en cada controlador
// Impacto: Los clientes reciben respuestas de error consistentes; los errores críticos se ocultan en producción

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
  // Como: ZodError ocurre cuando safeParse detecta datos inválidos — retorna los campos con problema
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation Error',
      message: 'Los datos enviados no son válidos',
      issues: err.issues.map((i) => ({
        field: i.path.join('.') || 'body',
        message: i.message,
      })),
    });
    return;
  }

  // Como: AppError es un error de negocio controlado — usa su statusCode y loguea como advertencia
  if (err instanceof AppError) {
    logger.warn(`[AppError] ${err.statusCode} — ${err.message}`);
    res.status(err.statusCode).json({
      error: 'Application Error',
      message: err.message,
    });
    return;
  }

  // Como: Cualquier otro error es inesperado — loguearlo como error crítico y ocultar detalles en producción
  const isProduction = process.env['NODE_ENV'] === 'production';
  logger.error('Error no controlado:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Ocurrió un error inesperado en el servidor',
    ...(isProduction ? {} : { stack: err instanceof Error ? err.stack : String(err) }),
  });
}
