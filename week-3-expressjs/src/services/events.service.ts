import { CateringEvent, CreateCateringEventDto, UpdateCateringEventDto, PaginatedResponse, PaginationParams } from '../types';
import * as repo from '../repositories/events.repository';

export async function findAll(params: PaginationParams): Promise<PaginatedResponse<CateringEvent>> {
  const { page, limit } = params;
  const all = await repo.findAll();
  const start = (page - 1) * limit;
  const data = all.slice(start, start + limit);
  return { data, total: all.length, page, limit };
}

export async function findById(id: number): Promise<CateringEvent | undefined> {
  return repo.findById(id);
}

export async function create(dto: CreateCateringEventDto): Promise<CateringEvent> {
  return repo.create(dto);
}

export async function update(id: number, dto: UpdateCateringEventDto): Promise<CateringEvent | undefined> {
  const exists = await repo.findById(id);
  if (!exists) return undefined;
  return repo.update(id, dto);
}

export async function remove(id: number): Promise<boolean> {
  const exists = await repo.findById(id);
  if (!exists) return false;
  return repo.remove(id);
}
