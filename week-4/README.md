# Week 04 — API Catering: Validación, Errores y Logging

## Dominio asignado

**Servicios de Catering** — recurso principal: `Event`

Gestiona eventos de catering (bodas, conferencias, cócteles, brunch) con validación robusta, manejo estructurado de errores y logging profesional.

## Recurso principal: `Event`

| Campo | Tipo | Validación |
|---|---|---|
| `name` | string | Min 3, Max 120 caracteres |
| `date` | string (ISO 8601) | Formato datetime obligatorio |
| `location` | string | Min 5 caracteres |
| `guestCount` | number | Entero positivo, máx 5000 |
| `menuType` | enum | buffet \| formal \| cocktail \| brunch \| degustacion |
| `pricePerPerson` | number | Positivo (COP) |
| `status` | enum | pending \| confirmed \| cancelled \| completed |

## Endpoints

| Método | Ruta | Descripción | Status |
|---|---|---|---|
| GET | `/api/v1/events` | Listar con paginación | 200 |
| GET | `/api/v1/events/:id` | Obtener por id | 200 / 404 |
| POST | `/api/v1/events` | Crear evento | 201 / 400 |
| PUT | `/api/v1/events/:id` | Actualizar evento | 200 / 400 / 404 |
| DELETE | `/api/v1/events/:id` | Eliminar evento | 204 / 404 |

## Cómo ejecutar

```bash
cp .env.example .env
pnpm install
pnpm dev
```

## Ejemplos de request/response

### POST /api/v1/events — Crear evento
```json
{
  "name": "Gala Corporativa 2025",
  "date": "2025-11-30T19:00:00Z",
  "location": "Hotel Tequendama, Bogotá",
  "guestCount": 150,
  "menuType": "formal",
  "pricePerPerson": 95000
}
```

### POST con body inválido → 400
```json
{
  "error": "Validation Error",
  "message": "Los datos enviados no son válidos",
  "issues": [
    { "field": "guestCount", "message": "El número de invitados debe ser mayor a 0" }
  ]
}
```

### GET /api/v1/events/999 → 404
```json
{
  "error": "Application Error",
  "message": "Evento con id 999 no encontrado"
}
```
