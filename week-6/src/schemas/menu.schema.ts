// Como: Define el schema Zod para validar los DTOs de creación y actualización de menús
// Para: Validar datos de entrada en el controlador antes de pasar al repositorio de Mongoose
// Impacto: Mensajes de error descriptivos en español sin tocar la lógica del model de Mongoose

import { z } from 'zod';

const CATEGORIES = ['desayuno', 'almuerzo', 'cena', 'cocktail', 'brunch'] as const;

export const createMenuSchema = z.object({
  name: z
    .string({ required_error: 'El nombre del menú es obligatorio' })
    .min(2, 'Mínimo 2 caracteres')
    .max(100, 'Máximo 100 caracteres')
    .trim(),

  description: z
    .string({ required_error: 'La descripción es obligatoria' })
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'Máximo 500 caracteres')
    .trim(),

  category: z.enum(CATEGORIES, {
    error: `La categoría debe ser: ${CATEGORIES.join(' | ')}`,
  }),

  pricePerPerson: z
    .number({ required_error: 'El precio por persona es obligatorio' })
    .positive('El precio debe ser mayor a 0'),

  available: z.boolean().default(true),
});

export const updateMenuSchema = createMenuSchema.partial();

export type CreateMenuDto = z.infer<typeof createMenuSchema>;
export type UpdateMenuDto = z.infer<typeof updateMenuSchema>;
