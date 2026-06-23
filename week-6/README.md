# Week 06 — API Catering: MongoDB + Mongoose

## Dominio asignado

**Servicios de Catering** — entidades: `Menu` (secundaria) + `Event` (principal con populate)

API REST completa con dos entidades relacionadas, paginación, populate() automático y manejo de errores CastError y 11000.

## Diagrama de entidades

```
Menu (Secondary)                    Event (Primary)
─────────────────                   ──────────────────────────
_id: ObjectId                       _id: ObjectId
name: String (unique)               name: String
description: String       1 ───< N  date: Date
category: String                    location: String
pricePerPerson: Number              guestCount: Number
available: Boolean                  status: String
createdAt: Date                     totalPrice: Number  ← guestCount × menu.pricePerPerson
updatedAt: Date                     menu: ObjectId (ref: Menu)
                                    createdAt: Date
                                    updatedAt: Date
```

## Endpoints

### Menús (entidad secundaria)
| Método | Ruta | Descripción | Status |
|---|---|---|---|
| GET | `/api/v1/menus` | Listar todos | 200 |
| GET | `/api/v1/menus/:id` | Obtener por id | 200 / 400 / 404 |
| POST | `/api/v1/menus` | Crear menú | 201 / 400 / 409 |
| PUT | `/api/v1/menus/:id` | Actualizar | 200 / 400 / 404 |
| DELETE | `/api/v1/menus/:id` | Eliminar | 204 / 400 / 404 |

### Eventos (entidad principal — con populate)
| Método | Ruta | Descripción | Status |
|---|---|---|---|
| GET | `/api/v1/events?page=1&limit=10` | Listar con paginación + menú | 200 |
| GET | `/api/v1/events/:id` | Detalle con menú populado | 200 / 400 / 404 |
| POST | `/api/v1/events` | Crear (calcula totalPrice) | 201 / 400 / 404 |
| PUT | `/api/v1/events/:id` | Actualizar | 200 / 400 / 404 |
| DELETE | `/api/v1/events/:id` | Eliminar | 204 / 400 / 404 |

## Cómo ejecutar

```bash
# 1. Levantar MongoDB
docker compose up -d

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Ejecutar seed (menus primero, luego events)
pnpm seed

# 5. Iniciar servidor
pnpm dev
```

## Errores manejados

| Error Mongoose | Causa | Respuesta |
|---|---|---|
| CastError | ObjectId malformado en params | 400 |
| MongoServerError 11000 | name duplicado en Menu | 409 |
| null en findById | Documento no existe | 404 |

## Ejemplo GET /api/v1/events/:id — con populate

```json
{
  "data": {
    "_id": "6678abc123def456",
    "name": "Boda Rodríguez & García",
    "date": "2025-09-15T18:00:00.000Z",
    "location": "Hacienda El Rosal, Bogotá",
    "guestCount": 200,
    "status": "confirmed",
    "totalPrice": 24000000,
    "menu": {
      "_id": "6678xyz789abc012",
      "name": "Cena de Gala",
      "category": "cena",
      "pricePerPerson": 120000,
      "available": true
    }
  }
}
```
