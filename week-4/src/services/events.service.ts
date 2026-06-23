// Como: Orquesta la lógica de negocio del dominio catering validando reglas e invocando el repositorio
// Para: Mantener los controladores delgados y concentrar las reglas del negocio en un único lugar
// Impacto: Los controladores no conocen detalles de almacenamiento; las reglas de estado se cambian aquí

import { Event, PaginatedResponse } from '../types';
import * as repo from '../repositories/events.repository';
import { AppError } from '../errors/AppError';

interface FindAllOptions {
  page: number;
  limit: number;
}

// Como: Calcula el slice correcto del array en memoria según page y limit (paginación offset)
export async function findAll(opts: FindAllOptions): Promise<PaginatedResponse<Event>> {
  const { page, limit } = opts;
  const all = await repo.findAll();
  const start = (page - 1) * limit;
  const data = all.slice(start, start + limit);
  return { data, total: all.length, page, limit };
}

// Como: Lanza AppError 404 si el evento no existe en lugar de devolver undefined al controlador
export async function findById(id: number): Promise<Event> {
  const event = await repo.findById(id);
  if (!event) throw new AppError(404, `Evento con id ${id} no encontrado`);
  return event;
}

// Como: Delega la creación al repositorio; aquí podrían agregarse reglas como límite de eventos por fecha
export async function create(dto: repo.CreateEventRepoDto): Promise<Event> {
  return repo.create(dto);
}

// Como: Verifica existencia antes de actualizar para diferenciar un 404 de una actualización vacía
export async function update(id: number, dto: repo.UpdateEventRepoDto): Promise<Event> {
  const exists = await repo.findById(id);
  if (!exists) throw new AppError(404, `Evento con id ${id} no encontrado`);
  const updated = await repo.update(id, dto);
  return updated!;
}

// Como: Verifica existencia antes de eliminar para responder 404 en vez de ignorar silenciosamente
export async function remove(id: number): Promise<void> {
  const exists = await repo.findById(id);
  if (!exists) throw new AppError(404, `Evento con id ${id} no encontrado`);
  await repo.remove(id);
}
