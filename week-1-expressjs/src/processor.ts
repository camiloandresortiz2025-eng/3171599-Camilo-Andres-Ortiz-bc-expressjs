import type { CateringEvent, CateringEventSummary } from './types.js';

export function filterByCategory(
  items: CateringEvent[],
  categoryFilter: string | null,
): CateringEvent[] {
  if (categoryFilter === null) return items;

  const lower = categoryFilter.toLowerCase();
  const filtered = items.filter((e) => e.category.toLowerCase() === lower);

  if (filtered.length === 0) {
    const available = Array.from(new Set(items.map((e) => e.category))).join(', ');
    throw new Error(
      `Categoría "${categoryFilter}" no encontrada. Categorías disponibles: ${available}`,
    );
  }

  return filtered;
}

export function calculateSummary(items: CateringEvent[]): CateringEventSummary {
  const active = items.filter((e) => e.active).length;
  const totalPrice = items.reduce((sum, e) => sum + e.price, 0);
  const averagePrice = Math.round((totalPrice / items.length) * 100) / 100;

  const sorted = [...items].sort((a, b) => a.price - b.price);
  const cheapest = sorted[0];
  const mostExpensive = sorted[sorted.length - 1];

  const categories = Array.from(new Set(items.map((e) => e.category)));

  return {
    total: items.length,
    active,
    inactive: items.length - active,
    averagePrice,
    mostExpensive,
    cheapest,
    categories,
  };
}
