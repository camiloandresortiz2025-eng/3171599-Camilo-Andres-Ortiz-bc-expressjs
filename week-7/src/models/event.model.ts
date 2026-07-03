// Como: Define el schema de Mongoose para CateringEvent — recurso principal del dominio
// Para: Persistir eventos de catering con validaciones de MongoDB y referencia al creador
// Impacto: Todos los campos obligatorios se validan en DB; totalPrice se recalcula en el repo

import mongoose, { Document, Schema } from 'mongoose';

export const EVENT_TYPES = [
  'Boda',
  'Corporativo',
  'Quinceañera',
  'Cumpleaños',
  'Graduación',
  'Lanzamiento',
] as const;

export const EVENT_STATUSES = [
  'pending',
  'confirmed',
  'in-progress',
  'cancelled',
  'completed',
] as const;

export type EventType   = (typeof EVENT_TYPES)[number];
export type EventStatus = (typeof EVENT_STATUSES)[number];

export interface IEvent extends Document {
  name:          string;
  eventType:     EventType;
  date:          Date;
  location:      string;        // lugar del evento
  guestCount:    number;        // número de invitados
  menu:          string;        // descripción libre del menú
  status:        EventStatus;
  pricePerGuest: number;        // precio por persona en COP
  totalPrice:    number;        // calculado: guestCount × pricePerGuest
  createdBy:     mongoose.Types.ObjectId; // referencia al usuario que registró el evento
  createdAt:     Date;
  updatedAt:     Date;
}

const eventSchema = new Schema<IEvent>(
  {
    name: {
      type:      String,
      required:  [true, 'El nombre del evento es requerido'],
      trim:      true,
      maxlength: [150, 'Máximo 150 caracteres'],
    },
    eventType: {
      type:     String,
      required: [true, 'El tipo de evento es requerido'],
      enum: {
        values:  EVENT_TYPES,
        message: 'Tipo de evento inválido',
      },
    },
    date: {
      type:     Date,
      required: [true, 'La fecha del evento es requerida'],
    },
    location: {
      type:      String,
      required:  [true, 'El lugar del evento es requerido'],
      trim:      true,
      maxlength: [200, 'Máximo 200 caracteres'],
    },
    guestCount: {
      type:     Number,
      required: [true, 'El número de invitados es requerido'],
      min:      [1, 'Mínimo 1 invitado'],
      max:      [5000, 'Máximo 5000 invitados'],
    },
    menu: {
      type:      String,
      required:  [true, 'La descripción del menú es requerida'],
      trim:      true,
      maxlength: [300, 'Máximo 300 caracteres'],
    },
    status: {
      type:    String,
      enum: {
        values:  EVENT_STATUSES,
        message: 'Estado inválido',
      },
      default: 'pending',
    },
    pricePerGuest: {
      type:     Number,
      required: [true, 'El precio por persona es requerido'],
      min:      [10000, 'Precio mínimo: $10.000 COP'],
      max:      [1000000, 'Precio máximo: $1.000.000 COP'],
    },
    totalPrice: {
      type:     Number,
      required: [true, 'El precio total es requerido'],
      min:      [0, 'El precio total no puede ser negativo'],
    },
    // Como: ObjectId con ref permite populate() para mostrar nombre del creador
    createdBy: {
      type:     Schema.Types.ObjectId,
      ref:      'User',
      required: [true, 'El creador del evento es requerido'],
    },
  },
  { timestamps: true },
);

export const EventModel = mongoose.model<IEvent>('Event', eventSchema);
