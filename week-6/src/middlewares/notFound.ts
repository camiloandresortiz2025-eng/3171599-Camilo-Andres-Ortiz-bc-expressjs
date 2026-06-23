// Como: Captura cualquier ruta no registrada y genera un AppError 404
// Para: Garantizar respuestas JSON consistentes para rutas inexistentes
// Impacto: Los clientes nunca reciben HTML de error de Express — siempre JSON con mensaje descriptivo

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export function notFound(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(404, `Ruta ${req.method} ${req.path} no encontrada`));
}
