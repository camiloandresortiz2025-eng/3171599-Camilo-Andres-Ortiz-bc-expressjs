import { readItems } from './reader.js';
import { filterByCategory, calculateSummary } from './processor.js';
import { writeReport } from './writer.js';
import type { Report } from './types.js';

async function main(): Promise<void> {
  // Parsear argumento --category desde process.argv
  const args = process.argv.slice(2);
  const categoryIndex = args.indexOf('--category');
  const categoryFilter: string | null =
    categoryIndex !== -1 ? (args[categoryIndex + 1] ?? null) : null;

  try {
    // 1. Leer datos
    const allItems = await readItems();

    // 2. Filtrar por categoría
    const items = filterByCategory(allItems, categoryFilter);

    // 3. Calcular resumen
    const summary = calculateSummary(items);

    // 4. Construir reporte
    const report: Report = {
      generatedAt: new Date().toISOString(),
      appliedFilter: categoryFilter,
      summary,
      items,
    };

    // 5. Imprimir resumen en consola
    console.log('\n========================================');
    console.log('   🍽️  CATERING ELITE — Reporte CLI');
    console.log('========================================');
    if (categoryFilter) {
      console.log(`   Filtro aplicado: ${categoryFilter}`);
    }
    console.log(`\n📊 Resumen de eventos:`);
    console.log(`   Total            : ${summary.total}`);
    console.log(`   Confirmados      : ${summary.active}`);
    console.log(`   Pendientes       : ${summary.inactive}`);
    console.log(`   Precio prom./pax : $${summary.averagePrice.toLocaleString('es-CO')} COP`);
    console.log(`   Más costoso/pax  : ${summary.mostExpensive.name} — $${summary.mostExpensive.price.toLocaleString('es-CO')} COP`);
    console.log(`   Más económico/pax: ${summary.cheapest.name} — $${summary.cheapest.price.toLocaleString('es-CO')} COP`);
    console.log(`   Categorías       : ${summary.categories.join(', ')}`);
    console.log('\n📋 Eventos incluidos:');
    items.forEach((e) => {
      const estado = e.active ? '✅' : '⏳';
      console.log(`   ${estado} [${e.category}] ${e.name} — ${e.guests} pax — ${e.date}`);
    });

    // 6. Escribir reporte en disco
    await writeReport(report);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`\n❌ Error: ${message}`);
    process.exit(1);
  }
}

main();
