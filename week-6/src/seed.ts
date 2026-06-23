// Como: Script idempotente que limpia e inserta datos de prueba del dominio catering en MongoDB
// Para: Proveer datos iniciales coherentes para desarrollo y pruebas sin inserciones manuales
// Impacto: Insertar siempre la entidad secundaria (Menu) PRIMERO para tener los _id disponibles

import 'dotenv/config';
import { connectDB, disconnectDB } from './lib/mongoose';
import { Menu } from './models/menu.model';
import { Event } from './models/event.model';

async function seed(): Promise<void> {
  await connectDB();

  // Como: Limpiar en orden inverso — primero eventos (que referencian menús), luego menús
  await Event.deleteMany({});
  await Menu.deleteMany({});
  console.log('✓ Colecciones limpiadas');

  // Como: Paso A — Insertar menús primero y capturar los _id para referenciarlos en eventos
  const [menuBuffet, menuFormal, menuCocktail, menuBrunch] = await Menu.insertMany([
    {
      name: 'Buffet Internacional',
      description: 'Variedad de platos internacionales con estaciones de carving y barra de ensaladas',
      category: 'almuerzo',
      pricePerPerson: 45000,
      available: true,
    },
    {
      name: 'Cena de Gala',
      description: 'Menú de 5 tiempos con maridaje de vinos seleccionados y servicio personalizado',
      category: 'cena',
      pricePerPerson: 120000,
      available: true,
    },
    {
      name: 'Cóctel Ejecutivo',
      description: 'Pasabocas calientes y fríos con barra de bebidas premium y estación de quesos',
      category: 'cocktail',
      pricePerPerson: 75000,
      available: true,
    },
    {
      name: 'Brunch Empresarial',
      description: 'Desayuno-almuerzo con estaciones de jugos, huevos al gusto y postres artesanales',
      category: 'brunch',
      pricePerPerson: 38000,
      available: true,
    },
  ]);
  console.log('✓ 4 menús insertados');

  // Como: Paso B — Insertar eventos usando los _id de los menús recién creados
  await Event.insertMany([
    {
      name: 'Boda Rodríguez & García',
      date: new Date('2025-09-15T18:00:00Z'),
      location: 'Hacienda El Rosal, Bogotá',
      guestCount: 200,
      status: 'confirmed',
      totalPrice: 200 * menuFormal.pricePerPerson,
      menu: menuFormal._id,
    },
    {
      name: 'Conferencia Tech Summit 2025',
      date: new Date('2025-10-22T08:00:00Z'),
      location: 'Centro de Convenciones, Medellín',
      guestCount: 500,
      status: 'pending',
      totalPrice: 500 * menuBuffet.pricePerPerson,
      menu: menuBuffet._id,
    },
    {
      name: 'Cóctel de Lanzamiento Startup',
      date: new Date('2025-08-05T19:00:00Z'),
      location: 'Terraza Sky, Bogotá',
      guestCount: 80,
      status: 'confirmed',
      totalPrice: 80 * menuCocktail.pricePerPerson,
      menu: menuCocktail._id,
    },
    {
      name: 'Gala Aniversario Corporativo',
      date: new Date('2025-11-30T19:30:00Z'),
      location: 'Club El Nogal, Bogotá',
      guestCount: 150,
      status: 'pending',
      totalPrice: 150 * menuFormal.pricePerPerson,
      menu: menuFormal._id,
    },
    {
      name: 'Feria de Emprendimiento SENA',
      date: new Date('2025-07-20T09:00:00Z'),
      location: 'SENA Chapinero, Bogotá',
      guestCount: 300,
      status: 'confirmed',
      totalPrice: 300 * menuBrunch.pricePerPerson,
      menu: menuBrunch._id,
    },
  ]);
  console.log('✓ 5 eventos insertados');

  console.log('✅ Seed completado exitosamente');
  await disconnectDB();
}

seed().catch((err: unknown) => {
  console.error('❌ Seed fallido:', err);
  process.exit(1);
});
