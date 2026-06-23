// Como: Almacena los eventos de catering en memoria con operaciones CRUD asíncronas
// Para: Aislar el acceso a datos del resto de la aplicación, facilitando migrar a BD sin tocar servicios
// Impacto: Las copias defensivas ({...event}) evitan mutaciones accidentales entre capas

import { Event } from '../types';

export type CreateEventRepoDto = Omit<Event, 'id' | 'createdAt'>;
export type UpdateEventRepoDto = Partial<CreateEventRepoDto>;

// Seed inicial con datos del dominio catering
let events: Event[] = [
  {
    id: 1,
    name: 'Boda Rodríguez & García',
    date: '2025-09-15T18:00:00Z',
    location: 'Hacienda El Rosal, Bogotá',
    guestCount: 200,
    menuType: 'formal',
    pricePerPerson: 85000,
    status: 'confirmed',
    createdAt: new Date('2025-06-01'),
  },
  {
    id: 2,
    name: 'Conferencia Tech Summit 2025',
    date: '2025-10-22T08:00:00Z',
    location: 'Centro de Convenciones, Medellín',
    guestCount: 500,
    menuType: 'buffet',
    pricePerPerson: 45000,
    status: 'pending',
    createdAt: new Date('2025-06-10'),
  },
  {
    id: 3,
    name: 'Cóctel de Lanzamiento Startup',
    date: '2025-08-05T19:00:00Z',
    location: 'Terraza Sky, Bogotá',
    guestCount: 80,
    menuType: 'cocktail',
    pricePerPerson: 120000,
    status: 'confirmed',
    createdAt: new Date('2025-06-15'),
  },
];

let nextId = 4;

// Como: Retorna copia del array para evitar que el llamador mute los datos internos
export async function findAll(): Promise<Event[]> {
  return [...events];
}

// Como: Retorna copia del objeto encontrado o undefined si el id no existe
export async function findById(id: number): Promise<Event | undefined> {
  const event = events.find((e) => e.id === id);
  return event ? { ...event } : undefined;
}

// Como: Asigna id autoincremental y fecha de creación antes de insertar
export async function create(dto: CreateEventRepoDto): Promise<Event> {
  const event: Event = { id: nextId++, ...dto, createdAt: new Date() };
  events.push(event);
  return { ...event };
}

// Como: Fusiona los campos del dto sobre el evento existente manteniendo los no enviados
export async function update(id: number, dto: UpdateEventRepoDto): Promise<Event | undefined> {
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) return undefined;
  events[index] = { ...events[index]!, ...dto };
  return { ...events[index]! };
}

// Como: Usa splice para eliminar el elemento y retorna true solo si existía
export async function remove(id: number): Promise<boolean> {
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) return false;
  events.splice(index, 1);
  return true;
}
