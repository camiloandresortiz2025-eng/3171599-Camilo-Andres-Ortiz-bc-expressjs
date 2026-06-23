// Como: Middleware de 3 parámetros registrado después de todas las rutas para capturar URLs no registradas
// Para: Garantizar que las rutas inexistentes devuelvan JSON 404 en lugar del HTML por defecto de Express
// Impacto: Los clientes de la API siempre reciben respuestas JSON coherentes, incluso para rutas inválidas

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export function notFound(req: Request, _res: Response, next: NextFunction): void {
  next(new AppError(404, `Ruta ${req.method} ${req.path} no encontrada`));
}
