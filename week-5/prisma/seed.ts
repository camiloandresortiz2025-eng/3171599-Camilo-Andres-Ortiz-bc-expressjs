// Como: Script idempotente que limpia e inserta datos de prueba del dominio catering en PostgreSQL
// Para: Proveer un estado inicial coherente para desarrollo y pruebas sin inserciones manuales
// Impacto: Ejecutar múltiples veces produce el mismo estado final — seguro para CI y onboarding de equipo

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🌱 Iniciando seed del dominio catering...');

  // Como: Eliminar en orden inverso para respetar las foreign keys (eventos primero, luego menús)
  await prisma.event.deleteMany();
  await prisma.menu.deleteMany();
  console.log('  Tablas limpiadas ✓');

  // Como: Crear menús primero para obtener sus IDs y usarlos en los eventos
  const menuBuffet = await prisma.menu.create({
    data: {
      name: 'Buffet Internacional',
      description: 'Variedad de platos internacionales con estaciones de carving y barra de ensaladas',
      category: 'almuerzo',
      pricePerPerson: 45000,
      available: true,
    },
  });

  const menuFormal = await prisma.menu.create({
    data: {
      name: 'Cena de Gala',
      description: 'Menú de 5 tiempos con maridaje de vinos seleccionados y servicio personalizado',
      category: 'cena',
      pricePerPerson: 120000,
      available: true,
    },
  });

  const menuCocktail = await prisma.menu.create({
    data: {
      name: 'Cóctel Ejecutivo',
      description: 'Pasabocas calientes y fríos con barra de bebidas premium y estación de quesos',
      category: 'cocktail',
      pricePerPerson: 75000,
      available: true,
    },
  });

  const menuBrunch = await prisma.menu.create({
    data: {
      name: 'Brunch Empresarial',
      description: 'Desayuno-almuerzo con estaciones de jugos, huevos al gusto y postres artesanales',
      category: 'brunch',
      pricePerPerson: 38000,
      available: true,
    },
  });

  console.log('  4 menús creados ✓');

  // Como: Crear eventos referenciando los menuId obtenidos arriba — totalPrice se calcula automáticamente
  const result = await prisma.event.createMany({
    data: [
      {
        name: 'Boda Rodríguez & García',
        date: new Date('2025-09-15T18:00:00Z'),
        location: 'Hacienda El Rosal, Bogotá',
        guestCount: 200,
        status: 'confirmed',
        totalPrice: 200 * menuFormal.pricePerPerson,
        menuId: menuFormal.id,
      },
      {
        name: 'Conferencia Tech Summit 2025',
        date: new Date('2025-10-22T08:00:00Z'),
        location: 'Centro de Convenciones, Medellín',
        guestCount: 500,
        status: 'pending',
        totalPrice: 500 * menuBuffet.pricePerPerson,
        menuId: menuBuffet.id,
      },
      {
        name: 'Cóctel de Lanzamiento Startup',
        date: new Date('2025-08-05T19:00:00Z'),
        location: 'Terraza Sky, Bogotá',
        guestCount: 80,
        status: 'confirmed',
        totalPrice: 80 * menuCocktail.pricePerPerson,
        menuId: menuCocktail.id,
      },
      {
        name: 'Gala Aniversario Corporativo',
        date: new Date('2025-11-30T19:30:00Z'),
        location: 'Club El Nogal, Bogotá',
        guestCount: 150,
        status: 'pending',
        totalPrice: 150 * menuFormal.pricePerPerson,
        menuId: menuFormal.id,
      },
      {
        name: 'Feria de Emprendimiento SENA',
        date: new Date('2025-07-20T09:00:00Z'),
        location: 'SENA Chapinero, Bogotá',
        guestCount: 300,
        status: 'confirmed',
        totalPrice: 300 * menuBrunch.pricePerPerson,
        menuId: menuBrunch.id,
      },
    ],
  });

  console.log(`  ${result.count} eventos creados ✓`);
  console.log('✅ Seed completado exitosamente');
}

main()
  .catch((err: unknown) => {
    console.error('❌ Error en seed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
