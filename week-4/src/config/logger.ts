// Como: Configura Winston con formatos diferenciados por entorno y conecta Morgan a su stream HTTP
// Para: Centralizar todo el logging (requests, negocio, errores) en un único sistema observable
// Impacto: En desarrollo logs coloridos y legibles; en producción JSON estructurado listo para ingestar en ELK/Datadog

import { createLogger, format, transports } from 'winston';
import morgan from 'morgan';

const isDev = process.env['NODE_ENV'] !== 'production';

export const logger = createLogger({
  // Como: Nivel 'http' captura los requests de Morgan; 'warn' solo captura problemas en producción
  level: isDev ? 'http' : 'warn',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    isDev
      ? format.combine(
          format.colorize(),
          format.printf(({ timestamp, level, message }) =>
            `${String(timestamp)} [${level}]: ${String(message)}`
          )
        )
      : format.json()
  ),
  transports: [
    new transports.Console(),
    // Como: El archivo de errores solo existe en producción para no llenar disco en desarrollo
    ...(isDev ? [] : [new transports.File({ filename: 'logs/error.log', level: 'error' })]),
  ],
});

// Como: Adapta la interfaz write de Morgan al nivel http de Winston sin el \n final
const morganStream = {
  write: (message: string) => logger.http(message.trim()),
};

const morganFormat = isDev ? 'dev' : 'combined';
export const morganMiddleware = morgan(morganFormat, { stream: morganStream });
