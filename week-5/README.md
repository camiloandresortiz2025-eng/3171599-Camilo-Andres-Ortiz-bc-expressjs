# Week 05 — API Catering: PostgreSQL + Prisma ORM

## Dominio asignado

**Servicios de Catering** — entidades: `Menu` (secundaria) + `Event` (principal)

Migración de la API de memoria a PostgreSQL con Prisma ORM, migraciones versionadas y seed idempotente.

## Diagrama de entidades

```
Menu (1) ──────< Event (N)
  id              id
  name (unique)   name
  description     date
  category        location
  pricePerPerson  guestCount
  available       status
                  totalPrice  ← calculado: guestCount × menu.pricePerPerson
                  menuId (FK)
```

## Endpoints

| Método | Ruta | Descripción | Status |
|---|---|---|---|
| GET | `/api/v1/events` | Listado paginado con menú | 200 |
| GET | `/api/v1/events/:id` | Detalle con menú | 200 / 404 |
| POST | `/api/v1/events` | Crear (calcula totalPrice) | 201 / 400 / 404 |
| PUT | `/api/v1/events/:id` | Actualizar (recalcula precio) | 200 / 400 / 404 |
| DELETE | `/api/v1/events/:id` | Eliminar | 204 / 404 |

## Cómo ejecutar

```bash
# 1. Levantar PostgreSQL
docker compose up -d

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Ejecutar migración
pnpm dlx prisma migrate dev --name init

# 5. Insertar datos de prueba
pnpm dlx prisma db seed

# 6. Iniciar servidor
pnpm dev
```

## Errores de Prisma manejados

| Código Prisma | Causa | Respuesta |
|---|---|---|
| P2025 | Registro no encontrado en update/delete | 404 |
| P2003 | Foreign key violation (menuId inválido) | 404 |

## Ejemplo de response GET /api/v1/events/:id

```json
{
  "data": {
    "id": 1,
    "name": "Boda Rodríguez & García",
    "date": "2025-09-15T18:00:00.000Z",
    "location": "Hacienda El Rosal, Bogotá",
    "guestCount": 200,
    "status": "confirmed",
    "totalPrice": 24000000,
    "menu": {
      "id": 2,
      "name": "Cena de Gala",
      "category": "cena",
      "pricePerPerson": 120000
    }
  }
}
```
