// Como: Encapsula la conexión y desconexión de Mongoose en funciones reutilizables
// Para: Centralizar la configuración de la conexión a MongoDB en un único punto
// Impacto: server.ts y seed.ts usan connectDB() garantizando la misma configuración de conexión

import mongoose from 'mongoose';

export async function connectDB(): Promise<void> {
  const uri = process.env['MONGODB_URI'];
  if (!uri) throw new Error('MONGODB_URI no está definida en las variables de entorno');
  await mongoose.connect(uri);
  console.log('MongoDB conectado correctamente');
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  console.log('MongoDB desconectado');
}
