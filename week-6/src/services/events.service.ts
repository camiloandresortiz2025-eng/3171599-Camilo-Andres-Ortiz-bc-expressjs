// Como: Orquesta la lógica de negocio de eventos: calcula totalPrice y coordina con el repositorio
// Para: Encapsular las reglas del dominio catering (precio total, validación de disponibilidad del menú)
// Impacto: Si la lógica de precios cambia (ej. descuentos por volumen), solo se modifica este servicio

import * as repo from '../repositories/events.repository';
import type { CreateEventDto, UpdateEventDto } from '../schemas/event.schema';

export interface PaginatedEvents {
  data: unknown[];
  total: number;
  page: number;
  totalPages: number;
}

// Como: Delega la paginación al repositorio que usa skip/limit de Mongoose
export async function getAll(page: number, limit: number): Promise<PaginatedEvents> {
  return repo.findAll(page, limit);
}

// Como: El repositorio lanza AppError 404 si el evento no existe o CastError si el id es inválido
export async function getById(id: string): Promise<unknown> {
  return repo.findById(id);
}

// Como: Busca el precio del menú para calcular totalPrice antes de persistir el evento
export async function createEvent(dto: CreateEventDto): Promise<unknown> {
  const pricePerPerson = await repo.getMenuPrice(dto.menu);
  const totalPrice = dto.guestCount * pricePerPerson;
  return repo.create({ ...dto, totalPrice });
}

// Como: Recalcula totalPrice si cambia guestCount o menu en la actualización
export async function updateEvent(id: string, dto: UpdateEventDto): Promise<unknown> {
  let totalPrice: number | undefined;

  if (dto.guestCount !== undefined || dto.menu !== undefined) {
    // Como: Obtiene el evento actual para combinar con los campos actualizados en el cálculo
    const current = (await repo.findById(id)) as { guestCount: number; menu: { _id: string } };
    const menuId = dto.menu ?? current.menu._id.toString();
    const guestCount = dto.guestCount ?? current.guestCount;
    const pricePerPerson = await repo.getMenuPrice(menuId);
    totalPrice = guestCount * pricePerPerson;
  }

  return repo.update(id, { ...dto, ...(totalPrice !== undefined ? { totalPrice } : {}) });
}

// Como: El repositorio lanza AppError 404 si el evento no existe antes de eliminar
export async function deleteEvent(id: string): Promise<void> {
  return repo.remove(id);
}
