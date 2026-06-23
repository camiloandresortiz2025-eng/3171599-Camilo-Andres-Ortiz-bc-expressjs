// Como: Extiende Error nativo con statusCode para categorizar errores de negocio en MongoDB
// Para: Unificar el manejo de errores de Mongoose (CastError, 11000) con los errores de la API
// Impacto: El errorHandler puede distinguir 400/404/409/500 sin conocer los detalles de Mongoose

export class AppError extends Error {
  public readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
