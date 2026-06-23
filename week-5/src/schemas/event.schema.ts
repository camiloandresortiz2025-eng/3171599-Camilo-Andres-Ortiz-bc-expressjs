// Como: Define schemas Zod para validar los DTOs de eventos de catering incluyendo la referencia al menuId
// Para: Garantizar integridad de datos antes de llamar a Prisma y generar mensajes de error descriptivos
// Impacto: Errores de validación (400) detectados antes de consultar la BD, reduciendo carga innecesaria

import { z } from 'zod';

const EVENT_STATUSES = ['pending', 'confirmed', 'cancelled', 'completed'] as const;

export const createEventSchema = z.object({
  name: z
    .string({ required_error: 'El nombre del evento es obligatorio' })
    .min(3, 'Mínimo 3 caracteres')
    .max(120, 'Máximo 120 caracteres')
    .trim(),

  date: z
    .string({ required_error: 'La fecha es obligatoria' })
    .datetime({ message: 'Fecha en formato ISO 8601 (ej: 2025-12-31T20:00:00Z)' }),

  location: z
    .string({ required_error: 'La ubicación es obligatoria' })
    .min(5, 'Mínimo 5 caracteres')
    .trim(),

  guestCount: z
    .number({ required_error: 'El número de invitados es obligatorio' })
    .int('Debe ser un entero')
    .positive('Debe ser mayor a 0')
    .max(5000, 'Máximo 5000 invitados'),

  status: z.enum(EVENT_STATUSES).default('pending'),

  // Como: menuId referencia la entidad secundaria Menu en PostgreSQL
  menuId: z
    .number({ required_error: 'El menú es obligatorio' })
    .int('menuId debe ser un entero')
    .positive('menuId debe ser un entero positivo'),
});

export const updateEventSchema = createEventSchema.partial();

export type CreateEventDto = z.infer<typeof createEventSchema>;
export type UpdateEventDto = z.infer<typeof updateEventSchema>;
