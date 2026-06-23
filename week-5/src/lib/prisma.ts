// Como: Singleton de PrismaClient usando globalThis para evitar múltiples instancias con hot-reload de tsx
// Para: Garantizar una única conexión al pool de PostgreSQL por proceso Node.js
// Impacto: Previene el error "Too many connections" que ocurre al crear instancias en cada hot-reload

import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env['NODE_ENV'] === 'development' ? ['query', 'warn', 'error'] : ['warn', 'error'],
  });

if (process.env['NODE_ENV'] !== 'production') {
  globalForPrisma.prisma = prisma;
}
