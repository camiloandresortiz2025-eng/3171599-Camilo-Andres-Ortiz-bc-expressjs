import { CateringEvent, CreateCateringEventDto, UpdateCateringEventDto } from '../types';

// Store en memoria — única capa que toca estos datos
const store: CateringEvent[] = [
  { id: 1,  name: 'Boda García & Martínez',                  category: 'boda',         price: 95000,  guests: 180, venue: 'Hacienda La Esperanza, Bogotá',        coordinator: 'Laura Méndez',  menu: 'Menú Gourmet 5 tiempos',             date: '14 Jun 2025', active: true,  createdAt: '2025-01-10T08:00:00.000Z' },
  { id: 2,  name: 'Tech Summit 2025 — Grupo Innovar',         category: 'corporativo',  price: 48000,  guests: 320, venue: 'Centro de Convenciones Ágora, Bogotá',  coordinator: 'Carlos Ruiz',   menu: 'Coffee Break + Almuerzo Ejecutivo',  date: '22 Jul 2025', active: true,  createdAt: '2025-01-12T09:00:00.000Z' },
  { id: 3,  name: 'Quinceañera Valentina Luna',               category: 'quinceañera',  price: 72000,  guests: 250, venue: 'Salón Versalles, Medellín',              coordinator: 'Laura Méndez',  menu: 'Banquete Festivo + Pastelería',      date: '05 Ago 2025', active: true,  createdAt: '2025-01-15T10:00:00.000Z' },
  { id: 4,  name: 'Graduación Promoción 2025 — U. Nacional',  category: 'graduación',   price: 55000,  guests: 410, venue: 'Teatro de la Ciudad, Bogotá',            coordinator: 'Pedro Salcedo', menu: 'Cóctel de Bienvenida + Cena Formal', date: '30 Nov 2025', active: false, createdAt: '2025-01-18T11:00:00.000Z' },
  { id: 5,  name: 'Lanzamiento Producto — Bancolombia',       category: 'lanzamiento',  price: 110000, guests: 120, venue: 'Hotel Dann Carlton, Bogotá',             coordinator: 'Carlos Ruiz',   menu: 'Cóctel Premium + Finger Food',       date: '10 Jun 2025', active: true,  createdAt: '2025-01-20T12:00:00.000Z' },
  { id: 6,  name: 'Gala Benéfica — Fundación Corazón',       category: 'gala',         price: 135000, guests: 200, venue: 'Club El Nogal, Bogotá',                 coordinator: 'Ana Torres',    menu: 'Cena de Gala 6 tiempos + Maridaje', date: '18 Jul 2025', active: true,  createdAt: '2025-01-22T13:00:00.000Z' },
  { id: 7,  name: 'Cumpleaños 50 — Familia Restrepo',        category: 'cumpleaños',   price: 85000,  guests: 90,  venue: 'Finca Villa Verde, Sopó',               coordinator: 'Ana Torres',    menu: 'Asado Gourmet + Barra Libre',        date: '28 Jun 2025', active: false, createdAt: '2025-01-25T14:00:00.000Z' },
  { id: 8,  name: 'Convención Anual — Grupo Éxito',          category: 'corporativo',  price: 42000,  guests: 500, venue: 'Corferias, Bogotá',                     coordinator: 'Pedro Salcedo', menu: 'Brunch Ejecutivo + Estaciones',      date: '15 Sep 2025', active: false, createdAt: '2025-01-28T15:00:00.000Z' },
  { id: 9,  name: 'Boda Vargas & Ospina',                    category: 'boda',         price: 88000,  guests: 160, venue: 'Casa Medina, Bogotá',                   coordinator: 'Laura Méndez',  menu: 'Menú Mediterráneo 4 tiempos',        date: '20 Sep 2025', active: false, createdAt: '2025-02-01T09:00:00.000Z' },
  { id: 10, name: 'Grado de Honor — Colegio San Bartolomé',  category: 'graduación',   price: 60000,  guests: 280, venue: 'Club Los Lagartos, Bogotá',             coordinator: 'Carlos Ruiz',   menu: 'Cena Buffet Internacional',          date: '12 Oct 2025', active: false, createdAt: '2025-02-03T10:00:00.000Z' },
  { id: 11, name: 'Lanzamiento Colección — Arturo Calle',    category: 'lanzamiento',  price: 125000, guests: 80,  venue: 'Museo de Arte Moderno, Bogotá',         coordinator: 'Ana Torres',    menu: 'Cóctel de Arte + Tapas Gourmet',     date: '03 Nov 2025', active: false, createdAt: '2025-02-05T11:00:00.000Z' },
  { id: 12, name: 'Conferencia Salud 2025 — Colsanitas',     category: 'corporativo',  price: 45000,  guests: 150, venue: 'Hotel Tequendama, Bogotá',              coordinator: 'Pedro Salcedo', menu: 'Almuerzo Saludable + Coffee Breaks', date: '07 Ago 2025', active: true,  createdAt: '2025-02-07T12:00:00.000Z' },
];

let nextId = store.length + 1;

export async function findAll(): Promise<CateringEvent[]> {
  return [...store];
}

export async function findById(id: number): Promise<CateringEvent | undefined> {
  return store.find((e) => e.id === id);
}

export async function create(dto: CreateCateringEventDto): Promise<CateringEvent> {
  const event: CateringEvent = { id: nextId++, ...dto, createdAt: new Date().toISOString() };
  store.push(event);
  return { ...event };
}

export async function update(id: number, dto: UpdateCateringEventDto): Promise<CateringEvent | undefined> {
  const index = store.findIndex((e) => e.id === id);
  if (index === -1) return undefined;
  store[index] = { ...store[index]!, ...dto };
  return { ...store[index]! };
}

export async function remove(id: number): Promise<boolean> {
  const index = store.findIndex((e) => e.id === id);
  if (index === -1) return false;
  store.splice(index, 1);
  return true;
}
