// Como: Orquesta la lógica de negocio del dominio catering: calcula totalPrice y delega al repositorio
// Para: Encapsular las reglas del negocio (precio total, validación de menú) separadas de la capa HTTP
// Impacto: Si la lógica de cálculo de precios cambia, solo se modifica este archivo

import * as repo from '../repositories/events.repository';
import { AppError } from '../errors/AppError';
import { prisma } from '../lib/prisma';
import type { CreateEventDto, UpdateEventDto } from '../schemas/event.schema';

// Como: Delega la paginación al repositorio que usa Prisma skip/take
export async function listEvents(page: number, limit: number): Promise<repo.PaginatedResult> {
  return repo.findAll(page, limit);
}

// Como: Lanza AppError 404 si el evento no existe (lanzado desde el repositorio)
export async function getEvent(id: number): Promise<unknown> {
  return repo.findById(id);
}

// Como: Busca el menú para calcular totalPrice antes de persistir el evento
export async function createEvent(dto: CreateEventDto): Promise<unknown> {
  const menu = await prisma.menu.findUnique({ where: { id: dto.menuId } });
  if (!menu) throw new AppError(404, `Menú con id ${dto.menuId} no encontrado`);
  if (!menu.available) throw new AppError(409, `El menú "${menu.name}" no está disponible actualmente`);

  const totalPrice = dto.guestCount * menu.pricePerPerson;
  return repo.create({ ...dto, date: new Date(dto.date), totalPrice });
}

// Como: Recalcula totalPrice si cambia guestCount o menuId en la actualización
export async function updateEvent(id: number, dto: UpdateEventDto): Promise<unknown> {
  let totalPrice: number | undefined;

  if (dto.guestCount !== undefined || dto.menuId !== undefined) {
    // Como: Obtiene el evento actual para combinar con los campos actualizados
    const current = (await repo.findById(id)) as { guestCount: number; menuId: number };
    const menuId = dto.menuId ?? current.menuId;
    const guestCount = dto.guestCount ?? current.guestCount;
    const menu = await prisma.menu.findUnique({ where: { id: menuId } });
    if (!menu) throw new AppError(404, `Menú con id ${menuId} no encontrado`);
    totalPrice = guestCount * menu.pricePerPerson;
  }

  return repo.update(id, {
    ...dto,
    date: dto.date ? new Date(dto.date) : undefined,
    ...(totalPrice !== undefined ? { totalPrice } : {}),
  });
}

// Como: Delega la eliminación al repositorio que maneja el error P2025
export async function deleteEvent(id: number): Promise<void> {
  return repo.remove(id);
}
