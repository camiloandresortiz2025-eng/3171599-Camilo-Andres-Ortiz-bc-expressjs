// Como: Define el schema de Mongoose para la entidad principal Event con referencia ObjectId a Menu
// Para: Modelar la relación Event → Menu en MongoDB usando referencias para habilitar populate()
// Impacto: populate('menu') en el repositorio reemplaza el ObjectId por el documento Menu completo

import { Schema, model, Types } from 'mongoose';

interface IEvent {
  name: string;            // Nombre del evento (ej: "Boda García 2025")
  date: Date;              // Fecha y hora del evento
  location: string;        // Lugar de celebración
  guestCount: number;      // Número de comensales confirmados
  status: string;          // pending | confirmed | cancelled | completed
  totalPrice: number;      // Calculado: guestCount × menu.pricePerPerson
  menu: Types.ObjectId;    // Referencia al documento Menu
}

const eventSchema = new Schema<IEvent>(
  {
    name: {
      type: String,
      required: [true, 'El nombre del evento es requerido'],
      trim: true,
      maxlength: 150,
    },
    date: {
      type: Date,
      required: [true, 'La fecha del evento es requerida'],
    },
    location: {
      type: String,
      required: [true, 'La ubicación es requerida'],
      trim: true,
      maxlength: 200,
    },
    guestCount: {
      type: Number,
      required: [true, 'El número de invitados es requerido'],
      min: [1, 'Debe haber al menos 1 invitado'],
      max: [5000, 'El máximo de invitados es 5000'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'cancelled', 'completed'],
        message: 'Estado inválido — debe ser: pending, confirmed, cancelled o completed',
      },
      default: 'pending',
    },
    totalPrice: {
      type: Number,
      required: [true, 'El precio total es requerido'],
      min: [0, 'El precio total no puede ser negativo'],
    },
    // Como: Schema.Types.ObjectId con ref habilita populate() para cargar el menú completo
    menu: {
      type: Schema.Types.ObjectId,
      ref: 'Menu',
      required: [true, 'El menú es requerido'],
    },
  },
  { timestamps: true }
);

export const Event = model<IEvent>('Event', eventSchema);
