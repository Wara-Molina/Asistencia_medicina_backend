# 🏥 Sistema de Control de Asistencia — Backend API

Node.js + TypeScript + PostgreSQL (local) para la Carrera de Medicina.

---

## ⚡ Inicio rápido (Windows, sin Docker)

### Paso 1 — Crear la base de datos en PostgreSQL

Abre **pgAdmin** o **psql** y ejecuta:

```sql
CREATE DATABASE attendance_db;
```

### Paso 2 — Clonar / copiar el proyecto y configurar variables

```cmd
cd attendance-backend
copy .env.example .env
```

Abre `.env` con el Bloc de notas y cambia solo esto:

```env
DB_PASSWORD=tu_contraseña_de_postgres
```

Deja todo lo demás igual por ahora.

### Paso 3 — Instalar dependencias

```cmd
npm install
```

### Paso 4 — Levantar el servidor

```cmd
npm run dev
```

Verás en consola:

```
✅ Base de datos conectada correctamente
🚀 Servidor en http://localhost:3000
```

> Con `DB_SYNC=true` en el `.env`, TypeORM crea todas las tablas automáticamente al arrancar.
> No necesitas correr migraciones manualmente.

### Paso 5 — Poblar datos iniciales

Abre **otra terminal** en la misma carpeta:

```cmd
npm run seed
```

Verás las credenciales creadas:

```
admin@medicina.edu.bo      → Admin@2024!
director@medicina.edu.bo   → Director@2024!
c.mendoza@medicina.edu.bo  → 1234567
```

### Paso 6 — Verificar que funciona

```cmd
curl http://localhost:3000/health
```

Respuesta esperada:

```json
{ "status": "ok", "service": "attendance-api" }
```

---

## 📋 Todos los endpoints

### Auth

| Método | Ruta                | Descripción    |
| ------ | ------------------- | -------------- |
| POST   | `/api/auth/login`   | Iniciar sesión |
| POST   | `/api/auth/refresh` | Renovar token  |
| POST   | `/api/auth/logout`  | Cerrar sesión  |

### Marcados

| Método | Ruta                       | Roles           |
| ------ | -------------------------- | --------------- |
| POST   | `/api/marcados/registrar`  | todos           |
| POST   | `/api/marcados/entrada`    | docente         |
| POST   | `/api/marcados/salida`     | docente         |
| GET    | `/api/marcados/:docenteId` | todos           |
| GET    | `/api/marcados/reporte`    | admin, director |

### Docentes

| Método | Ruta                | Roles           |
| ------ | ------------------- | --------------- |
| GET    | `/api/docentes`     | admin, director |
| GET    | `/api/docentes/:id` | todos           |
| POST   | `/api/docentes`     | admin           |
| PUT    | `/api/docentes/:id` | admin           |

### Horarios

| Método | Ruta                         | Roles |
| ------ | ---------------------------- | ----- |
| GET    | `/api/horarios/docente/:id`  | todos |
| GET    | `/api/horarios/paralelo/:id` | todos |
| POST   | `/api/horarios`              | admin |

### Ubicaciones

| Método | Ruta                   | Roles |
| ------ | ---------------------- | ----- |
| GET    | `/api/ubicaciones`     | todos |
| GET    | `/api/ubicaciones/:id` | todos |
| POST   | `/api/ubicaciones`     | admin |
| PUT    | `/api/ubicaciones/:id` | admin |

### Materias y Paralelos

| Método | Ruta             | Roles |
| ------ | ---------------- | ----- |
| GET    | `/api/materias`  | todos |
| POST   | `/api/materias`  | admin |
| GET    | `/api/paralelos` | todos |
| POST   | `/api/paralelos` | admin |

---

## 🧪 Ejemplos con curl (Windows PowerShell)

### Login

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"admin@medicina.edu.bo","password":"Admin@2024!"}'
```

### Registrar marcado campus

```powershell
$token = "TU_TOKEN_AQUI"
Invoke-RestMethod -Uri "http://localhost:3000/api/marcados/registrar" `
  -Method POST `
  -Headers @{ Authorization = "Bearer $token" } `
  -ContentType "application/json" `
  -Body '{"tipoMarcado":"app_campus","ubicacionId":"UUID_DEL_AULA"}'
```

### Marcado hospital con GPS

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/marcados/registrar" `
  -Method POST `
  -Headers @{ Authorization = "Bearer $token" } `
  -ContentType "application/json" `
  -Body '{"tipoMarcado":"app_hospital","ubicacionId":"UUID_HOSPITAL","latitud":-16.5001,"longitud":-68.1500}'
```

---

## 🗂️ Estructura del proyecto

```
src/
├── app.ts                     ← Entry point
├── config/
│   ├── database.ts            ← TypeORM + PostgreSQL
│   ├── cache.ts               ← Cache en memoria (Map) — reemplazar por Redis luego
│   └── logger.ts              ← Winston
├── models/                    ← 7 entidades (tablas)
│   ├── Docente.ts
│   ├── Materia.ts
│   ├── Paralelo.ts
│   ├── Horario.ts
│   ├── Ubicacion.ts
│   ├── Marcado.ts
│   └── Usuario.ts
├── controllers/               ← Lógica de endpoints
├── routes/
│   └── index.ts               ← Todas las rutas
├── middlewares/
│   ├── auth.ts                ← JWT + RBAC
│   └── errorHandler.ts
├── services/
│   ├── authService.ts         ← JWT, bcrypt, blacklist en memoria
│   ├── geoService.ts          ← Haversine GPS
│   └── validationService.ts   ← Lógica de marcados
├── validations/
│   └── schemas.ts             ← Todos los Zod schemas
└── seeds/
    └── index.ts               ← Datos iniciales
```

---

## 🔐 Roles

|                                  | docente | director | admin |
| -------------------------------- | :-----: | :------: | :---: |
| Login / marcados propios         |   ✅    |    ✅    |  ✅   |
| Ver todos los marcados (reporte) |   ❌    |    ✅    |  ✅   |
| Ver lista de docentes            |   ❌    |    ✅    |  ✅   |
| Crear/editar docentes            |   ❌    |    ❌    |  ✅   |
| Crear horarios                   |   ❌    |    ❌    |  ✅   |
| Gestionar ubicaciones            |   ❌    |    ❌    |  ✅   |

---

## 🔄 Scripts

```cmd
npm run dev       # Servidor con hot-reload
npm run build     # Compilar TypeScript → dist/
npm run start     # Servidor producción (requiere build)
npm run seed      # Datos iniciales
npm run test      # Tests unitarios
```

---

## 📌 Próximos pasos

- [ ] Agregar Redis cuando esté disponible (cambiar solo `src/config/cache.ts`)
- [ ] Integrar Flutter app con estos endpoints
- [ ] Módulo biométrico (ZK Pull)
- [ ] Sincronización offline (cola en BullMQ)
- [ ] Swagger UI en `/api/docs`
