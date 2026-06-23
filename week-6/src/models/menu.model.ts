// Como: Define el schema de Mongoose para la entidad secundaria Menu del dominio catering
// Para: Mapear el documento MongoDB a una interfaz TypeScript con validaciones a nivel de schema
// Impacto: El nombre 'Menu' determina la colección 'menus'; el campo unique genera índice en MongoDB

import { Schema, model } from 'mongoose';

interface IMenu {
  name: string;        // Nombre único del menú (ej: "Buffet Internacional")
  description: string; // Descripción del servicio de catering
  category: string;    // Tipo: desayuno | almuerzo | cena | cocktail | brunch
  pricePerPerson: number; // Precio base por comensal en COP
  available: boolean;  // Si el menú está disponible para nuevos eventos
}

const menuSchema = new Schema<IMenu>(
  {
    name: {
      type: String,
      required: [true, 'El nombre del menú es requerido'],
      unique: true,     // Como: Genera índice único en MongoDB — violación produce error 11000
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, 'La descripción es requerida'],
      trim: true,
      maxlength: 500,
    },
    category: {
      type: String,
      required: [true, 'La categoría es requerida'],
      enum: {
        values: ['desayuno', 'almuerzo', 'cena', 'cocktail', 'brunch'],
        message: 'Categoría inválida — debe ser: desayuno, almuerzo, cena, cocktail o brunch',
      },
    },
    pricePerPerson: {
      type: Number,
      required: [true, 'El precio por persona es requerido'],
      min: [0, 'El precio no puede ser negativo'],
    },
    available: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true } // Como: createdAt y updatedAt se gestionan automáticamente por Mongoose
);

export const Menu = model<IMenu>('Menu', menuSchema);
