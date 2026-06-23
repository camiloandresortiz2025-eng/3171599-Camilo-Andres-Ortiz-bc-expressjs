// Como: Implementa el acceso a datos con Prisma, capturando errores P2025, P2002 y P2003 para convertirlos en AppError
// Para: Aislar el conocimiento de Prisma y sus códigos de error en la capa de repositorio
// Impacto: Servicios y controladores no importan Prisma; reciben AppError tipado si algo falla en la BD

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { prisma } from '../lib/prisma';
import { AppError } from '../errors/AppError';
import type { CreateEventDto, UpdateEventDto } from '../schemas/event.schema';

export interface PaginatedResult {
  data: unknown[];
  total: number;
  page: number;
  limit: number;
}

// Como: Promise.all ejecuta count y findMany en paralelo para minimizar la latencia de la paginación
export async function findAll(page: number, limit: number): Promise<PaginatedResult> {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    prisma.event.findMany({
      skip,
      take: limit,
      include: { menu: true }, // Como: include carga el menú relacionado en la misma query
      orderBy: { createdAt: 'desc' },
    }),
    prisma.event.count(),
  ]);
  return { data, total, page, limit };
}

// Como: findUnique con include devuelve el evento con el menú anidado; lanza 404 si no existe
export async function findById(id: number): Promise<unknown> {
  const event = await prisma.event.findUnique({
    where: { id },
    include: { menu: true },
  });
  if (!event) throw new AppError(404, `Evento con id ${id} no encontrado`);
  return event;
}

// Como: Captura P2003 (foreign key violation) cuando el menuId referencia un menú que no existe
export async function create(data: CreateEventDto & { totalPrice: number; date: Date }): Promise<unknown> {
  try {
    return await prisma.event.create({ data, include: { menu: true } });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === 'P2003') throw new AppError(404, `Menú con id ${data.menuId} no encontrado`);
    }
    throw err;
  }
}

// Como: Captura P2025 (record not found) y P2003 (foreign key) en actualizaciones
export async function update(id: number, data: UpdateEventDto & { totalPrice?: number; date?: Date }): Promise<unknown> {
  try {
    return await prisma.event.update({
      where: { id },
      data,
      include: { menu: true },
    });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError) {
      if (err.code === 'P2025') throw new AppError(404, `Evento con id ${id} no encontrado`);
      if (err.code === 'P2003') throw new AppError(404, `Menú no encontrado`);
    }
    throw err;
  }
}

// Como: Captura P2025 cuando se intenta eliminar un evento que no existe en la BD
export async function remove(id: number): Promise<void> {
  try {
    await prisma.event.delete({ where: { id } });
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2025') {
      throw new AppError(404, `Evento con id ${id} no encontrado`);
    }
    throw err;
  }
}
