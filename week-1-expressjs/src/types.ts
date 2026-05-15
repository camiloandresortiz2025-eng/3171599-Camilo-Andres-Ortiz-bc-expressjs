// Recurso principal del dominio: Evento de Catering
export interface CateringEvent {
  id: string;
  name: string;
  category: string;    // boda | corporativo | quinceañera | cumpleaños | graduación | lanzamiento | gala
  price: number;       // precio por comensal en COP
  guests: number;
  venue: string;
  coordinator: string;
  menu: string;
  date: string;
  active: boolean;     // true = confirmado/en progreso | false = pendiente/cancelado
}

// Estadísticas calculadas sobre el conjunto de eventos
export interface CateringEventSummary {
  total: number;
  active: number;
  inactive: number;
  averagePrice: number;
  mostExpensive: CateringEvent;
  cheapest: CateringEvent;
  categories: string[];
}

// Reporte final que se escribe en output/report.json
export interface Report {
  generatedAt: string;
  appliedFilter: string | null;
  summary: CateringEventSummary;
  items: CateringEvent[];
}
