// Como: Encapsula todas las operaciones de MongoDB para CateringEvent
// Para: Aislar la capa de datos; el servicio nunca importa Mongoose directamente
// Impacto: Cambiar de MongoDB a otro ORM solo requiere modificar este archivo

import { EventModel, IEvent } from '../models/event.model';
import { CreateEventDto, UpdateEventDto } from '../schemas/event.schema';

export async function findAll(): Promise<IEvent[]> {
  // Como: populate('createdBy', 'name email') reemplaza el ObjectId por datos del usuario
  // Para: Que el cliente vea quién registró cada evento sin un segundo request
  return EventModel.find()
    .populate('createdBy', 'name email')
    .sort({ date: 1 }); // orden cronológico ascendente
}

export async function findById(id: string): Promise<IEvent | null> {
  return EventModel.findById(id).populate('createdBy', 'name email');
}

export async function create(
  data: CreateEventDto & { createdBy: string },
): Promise<IEvent> {
  // Como: totalPrice se calcula en el repositorio para garantizar consistencia
  // Para: Evitar que el cliente envíe un totalPrice falso o inconsistente
  const totalPrice = data.guestCount * data.pricePerGuest;
  return EventModel.create({ ...data, totalPrice });
}

export async function updateById(
  id: string,
  data: UpdateEventDto,
): Promise<IEvent | null> {
  // Como: Recalcula totalPrice si cambian guestCount o pricePerGuest
  // Para: Mantener totalPrice siempre coherente con los valores actuales
  const update: UpdateEventDto & { totalPrice?: number } = { ...data };

  if (data.guestCount !== undefined || data.pricePerGuest !== undefined) {
    const existing = await EventModel.findById(id);
    if (existing) {
      const guests = data.guestCount    ?? existing.guestCount;
      const price  = data.pricePerGuest ?? existing.pricePerGuest;
      update.totalPrice = guests * price;
    }
  }

  return EventModel.findByIdAndUpdate(id, update, {
    new:            true,  // retorna el documento actualizado
    runValidators:  true,  // ejecuta validaciones del schema de Mongoose
  }).populate('createdBy', 'name email');
}

export async function deleteById(id: string): Promise<boolean> {
  const result = await EventModel.findByIdAndDelete(id);
  return result !== null;
}
