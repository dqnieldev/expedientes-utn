# Documentación Técnica de Despliegue en Producción (Cloud Deployment)

**Proyecto**: Paperless System — Expedientes UTN  
**Fecha de Actualización**: 2026-07-28  
**Estado**: Listo para Producción (Vercel + Render + Supabase)  

---

## 1. Visión General del Despliegue

Este documento detalla la arquitectura de despliegue en la nube del **Paperless System**, cumpliendo con los estándares enterprise de alta disponibilidad y conectividad pública requeridos por la institución y para el consumo de servicios web desde dispositivos móviles (Android / Wear OS).

```
 ┌────────────────────────┐      HTTP/REST      ┌────────────────────────┐
 │   Frontend Web React   │ ──────────────────► │  Backend Node.js API   │
 │   (Vercel SPA Hosting) │                     │   (Render Web Service) │
 └────────────────────────┘                     └───────────┬────────────┘
                                                            │ Prisma ORM
                                                            ▼
                                                ┌────────────────────────┐
                                                │  PostgreSQL Database   │
                                                │   (Supabase Cloud DB)  │
                                                └────────────────────────┘
```

---

## 2. Componentes de la Arquitectura Cloud

| Componente | Servicio Cloud | Tipo | Enlace / Dominio |
|---|---|---|---|
| **Base de Datos** | Supabase / Render PostgreSQL | PostgreSQL 15 | `db.xxx.supabase.co` |
| **Backend Web API** | Render / Railway | Node.js + Express | `https://expedientes-utn-backend.onrender.com` |
| **Frontend Web App** | Vercel / Netlify | React SPA + Vite | `https://expedientes-utn.vercel.app` |

---

## 3. Guía Paso a Paso para Ejecutar el Despliegue

### Paso 1: Configurar la Base de Datos Remota (Supabase / Render)

1. Ingresar a [Supabase.com](https://supabase.com) y hacer clic en **New Project**.
2. Asignar nombre `expedientes-utn-db` y una contraseña segura para el usuario `postgres`.
3. Ir a **Project Settings > Database** y copiar la cadena de conexión **URI Connection String** (modo SSL habilitado):
   ```env
   DATABASE_URL="postgresql://postgres:[TU-PASSWORD]@db.xxxx.supabase.co:5432/postgres?sslmode=require"
   ```
4. Desde tu terminal local en el proyecto, ejecutar las migraciones y la carga inicial de seed:
   ```bash
   cd backend
   npx prisma db push
   node prisma/seed.js
   ```

---

### Paso 2: Desplegar el Backend API (Render)

1. Ingresar a [Render.com](https://render.com) y hacer clic en **New > Web Service**.
2. Conectar el repositorio GitHub `expedientes-utn`.
3. Configurar los campos clave:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `node src/server.js`
4. En la sección **Environment Variables**, agregar:
   - `DATABASE_URL`: *(Tu URL de Supabase obtenida en el Paso 1)*
   - `JWT_SECRET`: `PaperlessUTN_Production_Secret_Key_2026_Enterprise`
   - `FRONTEND_URL`: `https://expedientes-utn.vercel.app`
5. Hacer clic en **Create Web Service**. Al finalizar la compilación, copiar la URL pública generada (ej. `https://expedientes-utn-backend.onrender.com`).

---

### Paso 3: Desplegar el Frontend Web (Vercel)

1. Ingresar a [Vercel.com](https://vercel.com) y hacer clic en **Add New > Project**.
2. Importar el repositorio GitHub `expedientes-utn`.
3. Configurar los campos clave:
   - **Root Directory**: `frontend`
   - **Framework Preset**: `Vite`
4. En **Environment Variables**, agregar:
   - `VITE_API_URL`: `https://expedientes-utn-backend.onrender.com/api`
5. Hacer clic en **Deploy**. Al finalizar, el sistema otorgará la URL pública de producción (ej. `https://expedientes-utn.vercel.app`).

---

## 4. Archivos de Configuración de Producción Creados

1. **`frontend/vercel.json`**:
   - Garantiza que las rutas del cliente (React Router) se reescriban correctamente a `index.html` sin lanzar errores 404 al recargar el navegador.
2. **`backend/src/app.js`**:
   - Habilita el middleware de **CORS dinámico** permitiendo peticiones desde dominios Vercel y clientes móviles nativos.
3. **`frontend/.env.production.example` & `backend/.env.production.example`**:
   - Plantillas oficiales de variables de entorno para despliegue en la nube.

---

## 5. Verificación de Producción

Una vez completado el despliegue:
1. Abrir `https://expedientes-utn.vercel.app` en el navegador.
2. Probar inicio de sesión con credenciales de prueba:
   - **Administrador**: `darkcabrera@gmail.com` / `admin123`
   - **Desarrollador**: `paperlessutndev@gmail.com` / `dev123`
   - **Alumno**: `tic-310134@utnay.edu.mx` / `alumno123`
3. Probar navegación al módulo de **Analítica e Inteligencia de Datos** (`/developer/analitica`) y verificar la exportación a PDF.
