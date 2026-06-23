// Como: Implementa el CRUD de la entidad secundaria Menu con Mongoose, capturando CastError y error 11000
// Para: Aislar la lógica de acceso a MongoDB para menús y convertir errores de Mongoose en AppError
// Impacto: El servicio y el controlador reciben AppError tipado; no necesitan conocer MongoServerError

import { MongoServerError } from 'mongodb';
import mongoose from 'mongoose';
import { Menu } from '../models/menu.model';
import { AppError } from '../errors/AppError';
import type { CreateMenuDto, UpdateMenuDto } from '../schemas/menu.schema';

// Como: .lean() retorna objetos JS planos en lugar de documentos Mongoose, mejorando rendimiento
export async function findAll(): Promise<unknown[]> {
  return Menu.find().sort({ name: 1 }).lean();
}

export async function findById(id: string): Promise<unknown> {
  try {
    const menu = await Menu.findById(id).lean();
    if (!menu) throw new AppError(404, `Menú con id ${id} no encontrado`);
    return menu;
  } catch (err) {
    // Como: CastError ocurre cuando el id no tiene el formato válido de un ObjectId de MongoDB
    if (err instanceof mongoose.Error.CastError) {
      throw new AppError(400, 'ID inválido — debe ser un ObjectId de 24 caracteres hex');
    }
    throw err;
  }
}

export async function create(dto: CreateMenuDto): Promise<unknown> {
  try {
    const menu = await Menu.create(dto);
    return menu.toJSON();
  } catch (err) {
    // Como: Error 11000 es violación de índice único (name) en MongoDB
    if (err instanceof MongoServerError && err.code === 11000) {
      throw new AppError(409, `Ya existe un menú con el nombre "${dto.name}"`);
    }
    throw err;
  }
}

export async function update(id: string, dto: UpdateMenuDto): Promise<unknown> {
  try {
    const menu = await Menu.findByIdAndUpdate(id, dto, { new: true, runValidators: true }).lean();
    if (!menu) throw new AppError(404, `Menú con id ${id} no encontrado`);
    return menu;
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (err instanceof mongoose.Error.CastError) {
      throw new AppError(400, 'ID inválido — debe ser un ObjectId de 24 caracteres hex');
    }
    if (err instanceof MongoServerError && err.code === 11000) {
      throw new AppError(409, `Ya existe un menú con ese nombre`);
    }
    throw err;
  }
}

export async function remove(id: string): Promise<void> {
  try {
    const menu = await Menu.findByIdAndDelete(id);
    if (!menu) throw new AppError(404, `Menú con id ${id} no encontrado`);
  } catch (err) {
    if (err instanceof AppError) throw err;
    if (err instanceof mongoose.Error.CastError) {
      throw new AppError(400, 'ID inválido — debe ser un ObjectId de 24 caracteres hex');
    }
    throw err;
  }
}
