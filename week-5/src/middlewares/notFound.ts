// Como: Captura cualquier ruta no registrada y lanza AppError 404
// Para: Garantizar respuestas JSON consistentes para rutas inexistentes en lugar del HTML de Express
// Impacto: Los clientes de la API nunca reciben una página HTML de error

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export function notFound(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(404, `Ruta ${req.method} ${req.path} no encontrada`));
}
