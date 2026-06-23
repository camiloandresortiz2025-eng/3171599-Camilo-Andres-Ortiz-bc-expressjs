// Como: Configura Winston con formatos diferenciados por entorno y conecta Morgan a su stream HTTP
// Para: Centralizar todo el logging de la API en un único sistema con niveles y formatos configurables
// Impacto: Logs JSON estructurados en producción listos para ingestión en sistemas de observabilidad

import { createLogger, format, transports } from 'winston';
import morgan from 'morgan';

const isDev = process.env['NODE_ENV'] !== 'production';

export const logger = createLogger({
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
    ...(isDev ? [] : [new transports.File({ filename: 'logs/error.log', level: 'error' })]),
  ],
});

const morganStream = { write: (msg: string) => logger.http(msg.trim()) };
const morganFormat = isDev ? 'dev' : 'combined';
export const morganMiddleware = morgan(morganFormat, { stream: morganStream });
