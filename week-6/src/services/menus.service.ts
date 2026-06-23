// Como: Capa de servicio para menús que delega al repositorio de Mongoose
// Para: Mantener el patrón de capas separando HTTP, negocio y acceso a datos también para la entidad secundaria
// Impacto: Si la lógica de negocio de menús crece (ej. validar que haya staff disponible), se añade aquí

import * as repo from '../repositories/menus.repository';
import type { CreateMenuDto, UpdateMenuDto } from '../schemas/menu.schema';

export async function getAll(): Promise<unknown[]> {
  return repo.findAll();
}

export async function getById(id: string): Promise<unknown> {
  return repo.findById(id);
}

export async function createMenu(dto: CreateMenuDto): Promise<unknown> {
  return repo.create(dto);
}

export async function updateMenu(id: string, dto: UpdateMenuDto): Promise<unknown> {
  return repo.update(id, dto);
}

export async function deleteMenu(id: string): Promise<void> {
  return repo.remove(id);
}
