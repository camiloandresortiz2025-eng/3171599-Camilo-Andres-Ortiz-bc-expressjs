// Como: Contiene la lógica de negocio de los eventos de catering
// Para: Que el controlador solo maneje HTTP; las reglas de dominio viven aquí
// Impacto: Cambiar una regla de negocio solo requiere modificar este archivo

import { IEvent } from '../models/event.model';
import * as eventRepository from '../repositories/event.repository';
import { CreateEventDto, UpdateEventDto } from '../schemas/event.schema';
import { AppError } from '../errors/AppError';

export async function getAll(): Promise<IEvent[]> {
  return eventRepository.findAll();
}

export async function getById(id: string): Promise<IEvent> {
  // Como: Valida el formato del ObjectId antes de consultar MongoDB
  // Para: Evitar un CastError de Mongoose en IDs malformados — respondemos 400 en su lugar
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    throw new AppError(400, 'ID de evento inválido — debe ser un ObjectId de 24 caracteres');
  }

  const event = await eventRepository.findById(id);
  if (!event) throw new AppError(404, 'Evento no encontrado');
  return event;
}

export async function create(
  dto: CreateEventDto,
  userId: string,
): Promise<IEvent> {
  // Como: Regla de negocio — la fecha del evento debe ser futura
  // Para: Impedir que se registren eventos que ya ocurrieron
  const eventDate = new Date(dto.date);
  if (eventDate <= new Date()) {
    throw new AppError(400, 'La fecha del evento debe ser futura');
  }

  return eventRepository.create({ ...dto, createdBy: userId });
}

export async function update(
  id: string,
  dto: UpdateEventDto,
): Promise<IEvent> {
  // Verifica que el evento exista antes de actualizar (lanza 404 si no)
  await getById(id);

  // Como: Valida que la nueva fecha, si se envía, sea futura
  if (dto.date) {
    const newDate = new Date(dto.date);
    if (newDate <= new Date()) {
      throw new AppError(400, 'La fecha del evento debe ser futura');
    }
  }

  const updated = await eventRepository.updateById(id, dto);
  if (!updated) throw new AppError(404, 'Evento no encontrado');
  return updated;
}

export async function remove(id: string): Promise<void> {
  await getById(id); // lanza 404 si no existe antes de intentar eliminar
  const deleted = await eventRepository.deleteById(id);
  if (!deleted) throw new AppError(404, 'Evento no encontrado');
}
