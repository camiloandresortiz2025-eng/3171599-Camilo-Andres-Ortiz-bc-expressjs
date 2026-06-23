// Como: Define los tipos e interfaces del dominio catering usados en toda la aplicación
// Para: Centralizar el contrato de datos y evitar tipos duplicados entre capas
// Impacto: Cambiar un campo aquí propaga el error de TypeScript a todas las capas, previniendo inconsistencias

export type EventStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type MenuType = 'buffet' | 'formal' | 'cocktail' | 'brunch' | 'degustacion';

export interface Event {
  id: number;
  name: string;            // Nombre del evento (ej: "Boda García", "Gala Corporativa")
  date: string;            // Fecha ISO 8601 del evento
  location: string;        // Lugar de celebración
  guestCount: number;      // Número de invitados confirmados
  menuType: MenuType;      // Tipo de servicio de catering
  pricePerPerson: number;  // Precio por comensal en COP
  status: EventStatus;     // Estado del evento en el flujo de negocio
  createdAt: Date;
}

export interface SingleResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
  stack?: string;
}
