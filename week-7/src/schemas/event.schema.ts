// Como: Define los schemas Zod para validar DTOs de eventos catering
// Para: Detectar datos inválidos en el controlador antes de llegar a MongoDB
// Impacto: Un body malformado responde 400; datos válidos llegan tipados al servicio

import { z } from 'zod';
import { EVENT_TYPES, EVENT_STATUSES } from '../models/event.model';

export const createEventSchema = z.object({
  name: z
    .string({ error: 'El nombre del evento es obligatorio' })
    .min(3, 'Mínimo 3 caracteres')
    .max(150, 'Máximo 150 caracteres')
    .trim(),

  eventType: z.enum(EVENT_TYPES, {
    error: 'Tipo de evento inválido',
  }),

  // Como: .datetime() valida formato ISO 8601 — el modelo lo convierte a Date
  date: z
    .string({ error: 'La fecha es obligatoria' })
    .datetime({ message: 'Formato ISO 8601 requerido (ej: 2025-12-15T20:00:00Z)' }),

  location: z
    .string({ error: 'El lugar es obligatorio' })
    .min(5, 'Mínimo 5 caracteres')
    .max(200, 'Máximo 200 caracteres')
    .trim(),

  guestCount: z
    .number({ error: 'El número de invitados es obligatorio' })
    .int('Debe ser un número entero')
    .positive('Debe ser mayor a 0')
    .max(5000, 'Máximo 5000 invitados'),

  menu: z
    .string({ error: 'La descripción del menú es obligatoria' })
    .min(3, 'Mínimo 3 caracteres')
    .max(300, 'Máximo 300 caracteres')
    .trim(),

  status: z.enum(EVENT_STATUSES).optional().default('pending'),

  pricePerGuest: z
    .number({ error: 'El precio por persona es obligatorio' })
    .positive('Debe ser mayor a 0')
    .min(10000, 'Precio mínimo: $10.000 COP')
    .max(1000000, 'Precio máximo: $1.000.000 COP'),
});

// Como: .partial() hace todos los campos opcionales para soportar PATCH parcial
export const updateEventSchema = createEventSchema.partial();

export type CreateEventDto = z.infer<typeof createEventSchema>;
export type UpdateEventDto = z.infer<typeof updateEventSchema>;
