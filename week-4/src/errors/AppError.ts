// Como: Extiende Error nativo añadiendo statusCode e isOperational para categorizar errores
// Para: Distinguir errores de negocio controlados (404, 409) de fallos inesperados del sistema (500)
// Impacto: El errorHandler puede responder con el código HTTP exacto sin exponer stacktraces en producción

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    // Como: Restaura la cadena de prototipos rota al extender Error en TypeScript/ES5
    Object.setPrototypeOf(this, new.target.prototype);
    // Como: Excluye el constructor de la traza para que el stacktrace apunte al código de negocio
    Error.captureStackTrace(this, this.constructor);
  }
}

export function isAppError(err: unknown): err is AppError {
  return err instanceof AppError;
}
