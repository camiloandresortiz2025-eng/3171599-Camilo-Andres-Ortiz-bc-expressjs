// Como: Implementa el CRUD de Event con Mongoose, populate() del menú y manejo de CastError/11000
// Para: Encapsular el acceso a MongoDB para eventos incluyendo la carga del menú relacionado
// Impacto: populate('menu') carga el documento Menu completo en cada respuesta, evitando N+1 queries

import { MongoServerError } from 'mongodb';
import mongoose from 'mongoose';
import { Event } from '../models/event.model';
import { Menu } from '../models/menu.model';
import { AppError } from '../errors/AppError';
import type { CreateEventDto, UpdateEventDto } from '../schemas/event.schema';

export interface PaginatedResult {
  data: unknown[];
  total: number;
  page: number;
  totalPages: number;
}

// Como: Promise.all ejecuta count y find en paralelo para minimizar la latencia de la paginación
export async function findAll(page: number, limit: number): Promise<PaginatedResult> {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Event.find()
      .populate('menu')        // Como: Reemplaza el ObjectId del menú por el documento completo
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Event.countDocuments(),
  ]);
  return { data, total, page, totalPages: Math.ceil(total / limit) };
}

export async function findById(id: string): Promise<unknown> {
  try {
    const event = await Event.findById(id).populate('menu').lean();
    if (!event) throw new AppError(404, `Evento con id ${id} no encontrado`);
    return event;
  } catch (err) {
    if (err instanceof AppError) throw err;
    // Como: CastError ocurre cuando el id no tiene el formato de ObjectId válido
    if (err instanceof mongoose.Error.CastError) {
      throw new AppError(400, 'ID de evento inválido — debe ser un ObjectId de 24 caracteres hex');
    }
    throw err;
  }
}

export async function create(dto: CreateEventDto & { totalPrice: number }): Promise<unknown> {
  try {
    const event = await Event.create({ ...dto, date: new Date(dto.date) });
    // Como: populate después de create para retornar el menú completo en la respuesta 201
    return (await event.populate('menu')).toJSON();
  } catch (err) {
    if (err instanceof MongoServerError && err.code === 11000) {
      throw new AppError(409, 'Ya existe un evento con esos datos');
    }
    throw err;
  }
}

export async function update(id: string, dto: UpdateEventDto & { totalPrice?: number }): Promise<unknown> {
  try {
    const updateData = { ...dto, ...(dto.date ? { date: new Date(dto.date) } : {}) };
    const event = await Event.findByIdAndUpdate(id, updateData, { new: true, runValidators: true })
      .populate('menu')
      .lean();
    if (!event) throw new AppError(404, `Evento con id ${id} no encontrado`);
    return event;
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (err instanceof mongoose.Error.CastError) {
      throw new AppError(400, 'ID inválido — debe ser un ObjectId de 24 caracteres hex');
    }
    if (err instanceof MongoServerError && err.code === 11000) {
      throw new AppError(409, 'Ya existe un evento con esos datos');
    }
    throw err;
  }
}

export async function remove(id: string): Promise<void> {
  try {
    const event = await Event.findByIdAndDelete(id);
    if (!event) throw new AppError(404, `Evento con id ${id} no encontrado`);
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (err instanceof mongoose.Error.CastError) {
      throw new AppError(400, 'ID inválido — debe ser un ObjectId de 24 caracteres hex');
    }
    throw err;
  }
}

// Como: Busca el menú por id para calcular el totalPrice antes de crear o actualizar el evento
export async function getMenuPrice(menuId: string): Promise<number> {
  const menu = await Menu.findById(menuId).lean();
  if (!menu) throw new AppError(404, `Menú con id ${menuId} no encontrado`);
  return (menu as { pricePerPerson: number }).pricePerPerson;
}
