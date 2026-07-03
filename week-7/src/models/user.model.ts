// Como: Define el schema de Mongoose para el usuario del sistema Catering Elite
// Para: Soportar autenticación con bcrypt + JWT y dos roles del dominio catering
// Impacto: El rol 'coordinator' permite identificar qué usuarios pueden gestionar eventos

import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email:         string;
  password:      string; // siempre hasheado con bcrypt, nunca en texto plano
  name:          string;
  role:          'user' | 'coordinator' | 'admin';
  refreshToken?: string; // se almacena el HASH, nunca el token en claro
  createdAt:     Date;
  updatedAt:     Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type:     String,
      required: [true, 'El email es requerido'],
      unique:   true,
      lowercase: true,
      trim:     true,
    },
    password: {
      type:     String,
      required: [true, 'La contraseña es requerida'],
      select:   false, // nunca se devuelve en queries por defecto
    },
    name: {
      type:     String,
      required: [true, 'El nombre es requerido'],
      trim:     true,
    },
    role: {
      type:    String,
      // Como: 'coordinator' es el rol del dominio catering — puede registrar y gestionar eventos
      enum:    ['user', 'coordinator', 'admin'],
      default: 'user',
    },
    refreshToken: {
      type:   String,
      select: false, // nunca se devuelve por defecto
    },
  },
  { timestamps: true },
);

export const UserModel = mongoose.model<IUser>('User', userSchema);
