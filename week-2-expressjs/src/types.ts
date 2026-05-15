// Recurso principal del dominio: Evento de Catering
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
}

// DTO para crear un evento (sin id — se genera automáticamente)
export type CreateCateringEventDto = Omit<CateringEvent, 'id'>;

// DTO para actualización parcial
export type UpdateCateringEventDto = Partial<CreateCateringEventDto>;
