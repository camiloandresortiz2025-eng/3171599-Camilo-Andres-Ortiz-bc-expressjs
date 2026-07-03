# Week 07 — Catering Elite API: Autenticación JWT

API REST con autenticación completa (bcrypt + JWT access/refresh tokens en cookies HttpOnly) aplicada al dominio **Catering Elite**. El recurso protegido es `CateringEvent`.

## Dominio

**Recurso principal**: `CateringEvent`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `name` | string | Nombre del evento (ej. "Boda García & Martínez") |
| `eventType` | enum | Boda, Corporativo, Quinceañera, Cumpleaños, Graduación, Lanzamiento |
| `date` | Date | Fecha del evento (ISO 8601, debe ser futura) |
| `location` | string | Lugar de celebración |
| `guestCount` | number | Número de invitados (1–5000) |
| `menu` | string | Descripción del menú |
| `status` | enum | pending, confirmed, in-progress, cancelled, completed |
| `pricePerGuest` | number | Precio por persona en COP ($10.000–$1.000.000) |
| `totalPrice` | number | Calculado automáticamente: guestCount × pricePerGuest |
| `createdBy` | ObjectId | Referencia al usuario que registró el evento |

## Endpoints

### Autenticación (públicos excepto me y logout)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/api/v1/auth/register` | Registro de usuario |
| `POST` | `/api/v1/auth/login` | Login — emite cookies con access + refresh token |
| `GET`  | `/api/v1/auth/me` | Perfil del usuario autenticado 🔐 |
| `POST` | `/api/v1/auth/refresh` | Renueva access token (rotación de refresh) |
| `POST` | `/api/v1/auth/logout` | Cierra sesión e invalida refresh token 🔐 |

### Eventos (todos protegidos 🔐)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET`    | `/api/v1/events`      | Listar todos los eventos (orden cronológico) |
| `GET`    | `/api/v1/events/:id`  | Obtener un evento por ID |
| `POST`   | `/api/v1/events`      | Crear un nuevo evento |
| `PATCH`  | `/api/v1/events/:id`  | Actualización parcial |
| `DELETE` | `/api/v1/events/:id`  | Eliminar evento (204) |

## Cómo ejecutar

```bash
cd week-7

# 1. Instalar dependencias
pnpm install   # o npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editar .env:
#   JWT_ACCESS_SECRET=<openssl rand -base64 64>
#   JWT_REFRESH_SECRET=<openssl rand -base64 64>

# 3. Levantar MongoDB con Docker
docker compose up -d

# 4. Iniciar el servidor en modo desarrollo
pnpm dev
```

## Seguridad implementada

| Criterio | Implementación |
|----------|----------------|
| Contraseñas hasheadas | `bcrypt.hash()` con salt rounds = 10 |
| Secrets distintos | `JWT_ACCESS_SECRET` ≠ `JWT_REFRESH_SECRET` en `.env` |
| Tokens en cookies HttpOnly | `httpOnly: true`, `secure: true` en producción |
| Refresh token hasheado en DB | Solo el hash se guarda en `User.refreshToken` |
| Rotación de refresh token | Cada `POST /refresh` invalida el anterior y emite uno nuevo |
| Rutas protegidas | Todas las rutas de `/api/v1/events` usan `authMiddleware` |
| Sin secrets hardcodeados | Solo en `.env`, nunca en el código fuente |
| Anti user-enumeration | Mismo mensaje de error para email no encontrado y contraseña incorrecta |

## Flujo de prueba (Thunder Client / Postman)

```
1. POST /auth/register  { email, password, name }
2. POST /auth/login     { email, password }  → guarda cookies
3. GET  /auth/me                              → retorna perfil
4. POST /events         { name, eventType, date, location, guestCount, menu, pricePerGuest }
5. GET  /events                               → lista con populate de createdBy
6. GET  /events/:id
7. PATCH /events/:id    { status: "confirmed" }
8. DELETE /events/:id                         → 204
9. POST /auth/refresh                         → rota tokens
10. POST /auth/logout                          → limpia cookies
11. GET  /events                              → 401 (sin token)
```
