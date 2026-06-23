// Como: Define el schema Zod para validar DTOs de eventos, incluyendo el campo 'menu' como ObjectId
// Para: Detectar IDs de menú inválidos en el controlador antes de consultar MongoDB
// Impacto: Un ObjectId malformado responde 400 en el controlador; un ObjectId inexistente responde 404 en el repositorio

import { z } from 'zod';

// Como: Regex que valida el formato de un ObjectId de MongoDB (24 caracteres hexadecimales)
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
export const objectIdSchema = z.string().regex(objectIdRegex, 'ID inválido — debe ser un ObjectId de 24 caracteres hex');

const EVENT_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'] as const;

export const createEventSchema = z.object({
  name: z
    .string({ required_error: 'El nombre del evento es obligatorio' })
    .min(3, 'Mínimo 3 caracteres')
    .max(150, 'Máximo 150 caracteres')
    .trim(),

  date: z
    .string({ required_error: 'La fecha es obligatoria' })
    .datetime({ message: 'Fecha en formato ISO 8601 (ej: 2025-12-31T20:00:00Z)' }),

  location: z
    .string({ required_error: 'La ubicación es obligatoria' })
    .min(5, 'Mínimo 5 caracteres')
    .max(200, 'Máximo 200 caracteres')
    .trim(),

  guestCount: z
    .number({ required_error: 'El número de invitados es obligatorio' })
    .int('Debe ser un entero')
    .positive('Debe ser mayor a 0')
    .max(5000, 'Máximo 5000 invitados'),

  status: z.enum(EVENT_STATUSES).default('pending'),

  // Como: Valida que el campo menu sea un ObjectId válido antes de enviarlo a MongoDB
  menu: z.string().regex(objectIdRegex, 'ID de menú inválido — debe ser un ObjectId de 24 caracteres hex'),
});

export const updateEventSchema = createEventSchema.partial();

export type CreateEventDto = z.infer<typeof createEventSchema>;
export type UpdateEventDto = z.infer<typeof updateEventSchema>;
