import type { CateringEvent, CreateCateringEventDto, UpdateCateringEventDto } from './types';

// Store en memoria — simula una base de datos sin persistencia
const events: CateringEvent[] = [
  { id: 1,  name: 'Boda García & Martínez',                category: 'boda',         price: 95000,  guests: 180, venue: 'Hacienda La Esperanza, Bogotá',       coordinator: 'Laura Méndez',  menu: 'Menú Gourmet 5 tiempos',              date: '14 Jun 2025', active: true  },
  { id: 2,  name: 'Tech Summit 2025 — Grupo Innovar',      category: 'corporativo',  price: 48000,  guests: 320, venue: 'Centro de Convenciones Ágora, Bogotá', coordinator: 'Carlos Ruiz',   menu: 'Coffee Break + Almuerzo Ejecutivo',   date: '22 Jul 2025', active: true  },
  { id: 3,  name: 'Quinceañera Valentina Luna',            category: 'quinceañera', price: 72000,  guests: 250, venue: 'Salón Versalles, Medellín',             coordinator: 'Laura Méndez',  menu: 'Banquete Festivo + Pastelería',       date: '05 Ago 2025', active: true  },
  { id: 4,  name: 'Graduación Promoción 2025 — U. Nacional', category: 'graduación', price: 55000, guests: 410, venue: 'Teatro de la Ciudad, Bogotá',           coordinator: 'Pedro Salcedo', menu: 'Cóctel de Bienvenida + Cena Formal',  date: '30 Nov 2025', active: false },
  { id: 5,  name: 'Lanzamiento Producto — Bancolombia',    category: 'lanzamiento',  price: 110000, guests: 120, venue: 'Hotel Dann Carlton, Bogotá',           coordinator: 'Carlos Ruiz',   menu: 'Cóctel Premium + Finger Food',        date: '10 Jun 2025', active: true  },
  { id: 6,  name: 'Gala Benéfica — Fundación Corazón',    category: 'gala',         price: 135000, guests: 200, venue: 'Club El Nogal, Bogotá',                coordinator: 'Ana Torres',    menu: 'Cena de Gala 6 tiempos + Maridaje',  date: '18 Jul 2025', active: true  },
  { id: 7,  name: 'Cumpleaños 50 — Familia Restrepo',     category: 'cumpleaños',   price: 85000,  guests: 90,  venue: 'Finca Villa Verde, Sopó',              coordinator: 'Ana Torres',    menu: 'Asado Gourmet + Barra Libre',         date: '28 Jun 2025', active: false },
  { id: 8,  name: 'Convención Anual — Grupo Éxito',       category: 'corporativo',  price: 42000,  guests: 500, venue: 'Corferias, Bogotá',                    coordinator: 'Pedro Salcedo', menu: 'Brunch Ejecutivo + Estaciones',       date: '15 Sep 2025', active: false },
  { id: 9,  name: 'Boda Vargas & Ospina',                 category: 'boda',         price: 88000,  guests: 160, venue: 'Casa Medina, Bogotá',                  coordinator: 'Laura Méndez',  menu: 'Menú Mediterráneo 4 tiempos',         date: '20 Sep 2025', active: false },
  { id: 10, name: 'Grado de Honor — Colegio San Bartolomé', category: 'graduación', price: 60000,  guests: 280, venue: 'Club Los Lagartos, Bogotá',            coordinator: 'Carlos Ruiz',   menu: 'Cena Buffet Internacional',           date: '12 Oct 2025', active: false },
  { id: 11, name: 'Lanzamiento Colección — Arturo Calle', category: 'lanzamiento',  price: 125000, guests: 80,  venue: 'Museo de Arte Moderno, Bogotá',        coordinator: 'Ana Torres',    menu: 'Cóctel de Arte + Tapas Gourmet',      date: '03 Nov 2025', active: false },
  { id: 12, name: 'Conferencia Salud 2025 — Colsanitas',  category: 'corporativo',  price: 45000,  guests: 150, venue: 'Hotel Tequendama, Bogotá',             coordinator: 'Pedro Salcedo', menu: 'Almuerzo Saludable + Coffee Breaks',  date: '07 Ago 2025', active: true  },
];

let nextId = events.length + 1;

export function getAll(): CateringEvent[] {
  return events;
}

export function getById(id: number): CateringEvent | undefined {
  return events.find((e) => e.id === id);
}

export function create(data: CreateCateringEventDto): CateringEvent {
  const newEvent: CateringEvent = { id: nextId++, ...data };
  events.push(newEvent);
  return newEvent;
}

export function update(id: number, data: UpdateCateringEventDto): CateringEvent | undefined {
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) return undefined;
  events[index] = { ...events[index], ...data };
  return events[index];
}

export function remove(id: number): boolean {
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) return false;
  events.splice(index, 1);
  return true;
}
