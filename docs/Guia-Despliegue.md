# Guía de Despliegue en Servidor Producción (Link Público)

Esta guía detalla los pasos para desplegar el **Paperless System (Expedientes UTN)** en un servidor accesible públicamente para cumplir con el criterio 4 de la lista de cotejo de la asignatura **Desarrollo Web Integral**.

---

## Opción Recomendada: Architecture Cloud Gratuita

- **Base de Datos**: PostgreSQL en **Supabase** o **Render PostgreSQL**
- **Backend API**: Node.js Web Service en **Render** o **Railway**
- **Frontend Web**: SPA React en **Vercel** o **Netlify**

---

## Paso 1: Configuración de la Base de Datos PostgreSQL

1. Crear un proyecto en [Supabase](https://supabase.com) o [Render](https://render.com).
2. Obtener la cadena de conexión `DATABASE_URL` (SSL obligatorio en producción):
   ```env
   DATABASE_URL="postgresql://usuario:password@ep-host.region.aws.neon.tech/expedientes_db?sslmode=require"
   ```
3. Ejecutar las migraciones y el seed inicial desde tu terminal local conectada a la BD remota:
   ```bash
   cd backend
   npx prisma db push
   node prisma/seed.js
   ```

---

## Paso 2: Despliegue del Backend API (Render / Railway)

1. Conectar el repositorio GitHub `expedientes-utn` en Render / Railway.
2. Configurar la carpeta raíz del servicio como `/backend`.
3. Configurar el comando de compilación e inicio:
   - **Build Command**: `npm install && npx prisma generate`
   - **Start Command**: `node src/server.js`
4. Declarar las Variables de Entorno (Environment Variables):
   - `PORT`: `10000` (o asignado por la plataforma)
   - `DATABASE_URL`: La URL obtenida en el Paso 1.
   - `JWT_SECRET`: Una clave segura de al menos 32 caracteres.
   - `FRONTEND_URL`: `https://expedientes-utn.vercel.app` (URL de tu frontend desplegado).
5. Desplegar y copiar la URL pública generada (Ejemplo: `https://expedientes-utn-api.onrender.com`).

---

## Paso 3: Despliegue del Frontend React (Vercel / Netlify)

1. Importar el proyecto en [Vercel](https://vercel.com).
2. Seleccionar la carpeta raíz `/frontend`.
3. Framework Preset: **Vite**.
4. Declarar la Variable de Entorno:
   - `VITE_API_URL`: `https://expedientes-utn-api.onrender.com/api` (la URL del backend del Paso 2).
5. Hacer clic en **Deploy**. Copiar la URL pública asignada.

---

## Paso 4: Lista de Verificación Final del Despliegue

- [ ] La base de datos contiene los roles predeterminados `ADMIN`, `ALUMNO`, `DEVELOPER`.
- [ ] La API responde `HTTP 200` en la ruta `/` de la URL pública.
- [ ] El Frontend abre la pantalla de Login y permite la autenticación exitosa.
- [ ] La carga de documentos PDF almacena correctamente los archivos y actualiza el estado.
