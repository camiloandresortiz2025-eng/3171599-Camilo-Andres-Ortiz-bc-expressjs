// Como: Define los schemas Zod de creación y actualización de eventos de catering con validaciones de dominio
// Para: Validar los datos de entrada en el controlador antes de que lleguen al servicio o repositorio
// Impacto: Errores de validación detectados en la capa HTTP con mensajes descriptivos, sin tocar la lógica de negocio

import { z } from 'zod';

const EVENT_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'] as const;
const MENU_TYPES = ['buffet', 'formal', 'cocktail', 'brunch', 'degustacion'] as const;

export const createEventSchema = z.object({
  name: z
    .string({ required_error: 'El nombre del evento es obligatorio' })
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(120, 'El nombre no puede superar 120 caracteres')
    .trim(),

  date: z
    .string({ required_error: 'La fecha del evento es obligatoria' })
    .datetime({ message: 'La fecha debe estar en formato ISO 8601 (ej: 2025-12-31T20:00:00Z)' }),

  location: z
    .string({ required_error: 'La ubicación es obligatoria' })
    .min(5, 'La ubicación debe tener al menos 5 caracteres')
    .trim(),

  guestCount: z
    .number({ required_error: 'El número de invitados es obligatorio' })
    .int('El número de invitados debe ser un entero')
    .positive('El número de invitados debe ser mayor a 0')
    .max(5000, 'El máximo de invitados permitido es 5000'),

  menuType: z.enum(MENU_TYPES, {
    error: `El tipo de menú debe ser uno de: ${MENU_TYPES.join(', ')}`,
  }),

  pricePerPerson: z
    .number({ required_error: 'El precio por persona es obligatorio' })
    .positive('El precio por persona debe ser mayor a 0'),

  // Como: El status tiene valor por defecto 'pending' para nuevos eventos
  status: z.enum(EVENT_STATUSES).default('pending'),
});

export const updateEventSchema = createEventSchema.partial();

export type CreateEventDto = z.infer<typeof createEventSchema>;
export type UpdateEventDto = z.infer<typeof updateEventSchema>;
