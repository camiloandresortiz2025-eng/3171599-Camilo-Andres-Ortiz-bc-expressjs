// Como: Extiende Error nativo añadiendo statusCode para categorizar errores de negocio
// Para: Distinguir errores controlados (404, 409) de fallos del sistema (500)
// Impacto: El errorHandler usa statusCode para responder con el código HTTP correcto sin exponer detalles internos

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
