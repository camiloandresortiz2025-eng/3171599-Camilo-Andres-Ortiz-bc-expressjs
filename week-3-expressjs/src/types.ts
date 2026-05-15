// Recurso principal: Evento de Catering
export interface CateringEvent {
  id: number;
  name: string;
  category: string;    // boda | corporativo | quinceañera | cumpleaños | graduación | lanzamiento | gala
  price: number;       // precio por comensal en COP
  guests: number;
  venue: string;
  coordinator: string;
  menu: string;
  date: string;
  active: boolean;
  createdAt: string;
}

// DTO para crear — sin campos auto-generados
export type CreateCateringEventDto = Omit<CateringEvent, 'id' | 'createdAt'>;

// DTO para actualizar — todos los campos opcionales
export type UpdateCateringEventDto = Partial<CreateCateringEventDto>;

// Contratos de respuesta genéricos
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
}

export interface PaginationParams {
  page: number;
  limit: number;
}
