# 📄 Paperless System — Universidad Tecnológica de Nayarit

Sistema web institucional para la gestión digital de expedientes de alumnos, eliminando el uso de papel en procesos administrativos.

---

## 🚀 Stack Tecnológico

### Frontend
| Tecnología | Uso |
|---|---|
| React 18 + Vite | Framework y bundler |
| TailwindCSS | Estilos y diseño responsivo |
| Axios | Peticiones HTTP |
| React Router DOM | Navegación y rutas protegidas |
| react-i18next | Internacionalización (ES / EN) |
| Lucide React | Iconografía |

### Backend
| Tecnología | Uso |
|---|---|
| Node.js + Express | Servidor y API REST |
| PostgreSQL 18 | Base de datos relacional |
| Prisma ORM | Modelado y consultas a BD |
| JWT | Autenticación con tokens |
| bcryptjs | Hash de contraseñas |
| Nodemailer + Gmail | Envío de correos |
| node-cron | Tareas programadas (respaldos) |
| archiver | Compresión de archivos ZIP |
| express-validator | Validación de inputs |
| helmet | Headers de seguridad HTTP |
| morgan | Logs de peticiones HTTP |
| express-rate-limit | Limitación de intentos de login |
| multer | Manejo de archivos subidos |

---

## 🏗️ Arquitectura

expedientes-utn/
├── backend/
│   ├── src/
│   │   ├── backups/
│   │   │   ├── backup.service.js       # pg_dump + ZIP de /uploads
│   │   │   └── scheduler.service.js    # node-cron + persistencia JSON
│   │   ├── config/
│   │   │   ├── prisma.js               # Cliente Prisma
│   │   │   ├── mailer.js               # Transporter Gmail
│   │   │   └── multer.js               # PDF docs / JPG-PNG fotos
│   │   ├── controllers/                # Lógica de negocio + validaciones
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js      # verifyToken
│   │   │   └── role.middleware.js      # authorizeRoles
│   │   ├── routes/                     # Definición de endpoints
│   │   └── services/                   # Acceso a BD via Prisma
│   ├── backups/                        # Archivos .sql y .zip generados
│   ├── uploads/                        # PDFs y fotos de alumnos
│   ├── logs/
│   │   └── audit.log                   # Log de auditoría en archivo
│   ├── scheduler.config.json           # Configuración persistida del scheduler
│   └── nodemon.json                    # Ignora backups/, uploads/, logs/
│
└── frontend/
└── src/
├── components/                 # Componentes reutilizables
├── context/                    # (si aplica)
├── hooks/
│   └── useSessionManager.js    # Gestión de sesión e inactividad
├── i18n/
│   ├── index.js                # Configuración i18next
│   ├── es.json                 # Traducciones español
│   └── en.json                 # Traducciones inglés
├── layout/                     # Layouts por rol
├── pages/
│   ├── admin/                  # Vistas del administrador
│   └── alumno/                 # Vistas del alumno
└── services/                   # Axios + interceptores

---

## 🗄️ Modelo de Base de Datos

```prisma
model Usuario {
  id                 Int       @id @default(autoincrement())
  email              String    @unique
  password           String
  role               Role      @default(ALUMNO)
  mustChangePassword Boolean   @default(true)
  resetToken         String?
  resetTokenExpiry   DateTime?
  alumno             Alumno?
  createdAt          DateTime  @default(now())
  @@index([role])
}

model Alumno {
  id                  Int         @id @default(autoincrement())
  nombre              String
  matricula           String      @unique
  carrera             String
  cuatrimestre_actual Int
  estado              String      @default("ACTIVO")
  foto                String?
  curp                String?
  fecha_nacimiento    DateTime?
  lugar_nacimiento    String?
  sexo                String?
  estado_civil        String?
  calle               String?
  numero              String?
  colonia             String?
  codigo_postal       String?
  telefono            String?
  ciudad              String?
  estado_direccion    String?
  documentos          Documento[]
  usuarioId           Int         @unique
  usuario             Usuario     @relation(fields: [usuarioId], references: [id])
  createdAt           DateTime    @default(now())
  @@index([estado])
  @@index([carrera])
  @@index([createdAt])
}

model Documento {
  id           Int             @id @default(autoincrement())
  tipo         String
  url          String
  estado       EstadoDocumento @default(EN_REVISION)
  razonRechazo String?
  alumnoId     Int
  alumno       Alumno          @relation(fields: [alumnoId], references: [id])
  createdAt    DateTime        @default(now())
  @@unique([alumnoId, tipo])
  @@index([estado])
  @@index([alumnoId])
  @@index([createdAt])
}

model AuditLog {
  id        Int      @id @default(autoincrement())
  accion    String
  entidad   String
  entidadId Int?
  detalle   String?
  usuarioId Int?
  ip        String?
  createdAt DateTime @default(now())
  @@index([accion])
  @@index([usuarioId])
  @@index([createdAt])
}

enum EstadoDocumento { PENDIENTE EN_REVISION APROBADO RECHAZADO }
enum Role { ADMIN ALUMNO }
```

---

## 👥 Roles del Sistema

### 🎓 ALUMNO
- Accede a su panel personal
- Sube y reemplaza documentos (solo PDF, máx 5MB)
- Consulta el estado de cada documento
- Edita su perfil (datos personales, domicilio, contraseña, foto)
- Recibe notificaciones por email al ser aprobado/rechazado un documento

### 🛡️ ADMIN
- Gestión completa de alumnos (crear, editar, eliminar)
- Validar documentos (aprobar / rechazar con motivo)
- Cambiar estado de alumno (ACTIVO / BAJA / BAJA_TEMPORAL)
- Generar reportes PDF (general y por alumno)
- Recibe notificaciones cuando un alumno sube un documento

---

## 🔐 Seguridad

| Característica | Implementación |
|---|---|
| Hash de contraseñas | bcryptjs salt 10 |
| Autenticación | JWT con expiración de 8 horas |
| Protección de rutas | Middleware verifyToken + authorizeRoles |
| Headers HTTP | helmet con crossOriginResourcePolicy |
| CORS | Restringido al FRONTEND_URL |
| Rate limiting | 5 intentos fallidos → bloqueo 15 minutos |
| Validación de inputs | express-validator en controllers críticos |
| Logs HTTP | morgan en modo dev |
| Logs de auditoría | BD (AuditLog) + archivo logs/audit.log |
| Sesión por inactividad | 30 min → modal aviso → logout automático |
| Expiración forzada | Token JWT de 8 horas |
| Interceptor 401 | Logout automático en cualquier respuesta 401 |

---

## 📧 Sistema de Notificaciones por Email

| Evento | Destinatario |
|---|---|
| Alumno sube/reemplaza documento | Admin |
| Documento aprobado | Alumno |
| Documento rechazado (con motivo) | Alumno |
| Cambio de estado (BAJA / BAJA_TEMPORAL / ACTIVO) | Alumno |
| Respaldo automático completado | Admin |
| Recuperación de contraseña | Alumno |

---

## 💾 Sistema de Respaldos

- **Manual**: el admin crea un respaldo desde el panel en cualquier momento
- **Automático**: programable con frecuencia diaria, semanal o cada 6 horas
- **Contenido**: archivo `.sql` (base de datos) + archivo `.zip` (carpeta /uploads)
- **Gestión**: listar, descargar y eliminar respaldos desde el panel
- **Persistencia**: la configuración del scheduler se guarda en `scheduler.config.json` y se restaura al reiniciar el servidor
- **Notificación**: el admin recibe un email cuando se completa un respaldo automático

---

## 📋 Logs de Auditoría

Cada acción crítica queda registrada en la base de datos y en `logs/audit.log`:

| Acción | Descripción |
|---|---|
| `LOGIN` | Inicio de sesión exitoso |
| `LOGIN_FALLIDO` | Intento de login fallido |
| `CREAR_ALUMNO` | Registro de nuevo alumno |
| `ELIMINAR_ALUMNO` | Eliminación permanente de alumno |
| `CAMBIAR_ESTADO_ALUMNO` | Cambio de estado del alumno |
| `APROBAR_DOCUMENTO` | Aprobación de documento |
| `RECHAZAR_DOCUMENTO` | Rechazo de documento (con motivo) |
| `ACTUALIZAR_DOCUMENTO` | Cambio de estado de documento |
| `CREAR_BACKUP` | Creación de respaldo manual |

---

## 🌐 API REST — Endpoints

### Auth
POST   /api/auth/login
POST   /api/auth/change-password      # requiere token
POST   /api/auth/forgot-password      # { matricula }
POST   /api/auth/reset-password       # { token, newPassword }

### Alumnos

GET    /api/alumnos                   # ADMIN — todos
POST   /api/alumnos                   # ADMIN — crear
GET    /api/alumnos/me                # ALUMNO — perfil propio
GET    /api/alumnos/:id               # ADMIN — por ID
PUT    /api/alumnos/:id               # ADMIN — actualizar
DELETE /api/alumnos/:id               # ADMIN — eliminar permanente
PATCH  /api/alumnos/:id/estado        # ADMIN — cambiar estado
PUT    /api/alumnos/perfil            # ALUMNO — editar perfil propio
PUT    /api/alumnos/foto              # ALUMNO — cambiar foto

### Documentos

GET    /api/documentos                # ADMIN — todos
GET    /api/documentos/:alumnoId      # por alumno
POST   /api/documentos                # subir (PDF, máx 5MB)
PUT    /api/documentos/:id            # actualizar estado + razonRechazo

### Respaldos

GET    /api/backups                   # listar
POST   /api/backups/crear             # crear manual
DELETE /api/backups/:filename         # eliminar
GET    /api/backups/descargar/:filename
GET    /api/backups/scheduler         # obtener config
POST   /api/backups/scheduler         # guardar config

### Reportes

GET    /api/reportes/general          # PDF todos los alumnos
GET    /api/reportes/alumno/:id       # PDF expediente individual

### Auditoría
GET    /api/audit?page=1&limit=50&accion=LOGIN

---

## ⚙️ Variables de Entorno

Crea el archivo `backend/.env`:

```env
PORT=3000
DATABASE_URL=postgresql://usuario:password@localhost:5432/paperless_utn
JWT_SECRET=string_aleatorio_minimo_64_caracteres
GMAIL_USER=tucorreo@gmail.com
GMAIL_PASS=xxxx xxxx xxxx xxxx
FRONTEND_URL=http://localhost:5173
```

> **GMAIL_PASS**: No es tu contraseña de Gmail. Ve a Google Account → Seguridad → Verificación en 2 pasos → Contraseñas de aplicaciones → Generar.

---

## 🖥️ Instalación y Configuración

### Requisitos previos
- Node.js v18 o superior
- PostgreSQL 18
- Cuenta Gmail con contraseña de aplicación configurada

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd expedientes-utn
```

### 2. Configurar el backend
```bash
cd backend
npm install
```

Crea el archivo `.env` con las variables indicadas arriba.

```bash
npx prisma db push
npx prisma generate
```

### 3. Crear usuario administrador
```bash
node src/scripts/createAdmin.js
```

### 4. Configurar el frontend
```bash
cd ../frontend
npm install
```

### 5. Verificar ruta de PostgreSQL

En `backend/src/backups/backup.service.js` confirma que la ruta apunte a tu instalación:

```js
const PG_DUMP = `"C:\\Program Files\\PostgreSQL\\18\\bin\\pg_dump.exe"`;
```

### 6. Iniciar el proyecto

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

Abre el navegador en `http://localhost:5173`

---

## 🗺️ Estructura de Navegación

### Panel Alumno

/dashboard          → Resumen + documentos
/documentos         → Subir y gestionar documentos
/perfil             → Editar datos personales y contraseña

### Panel Admin

/admin/dashboard    → Métricas + alumnos recientes
/admin/alumnos      → CRUD de alumnos
/admin/alumnos/:id  → Detalle + expediente + zona de peligro
/admin/documentos   → Validar documentos
/admin/respaldos    → Gestión de respaldos
/admin/auditoria    → Logs de auditoría

### Rutas públicas
/                   → Login
/recuperar          → Solicitar recuperación de contraseña
/reset-password     → Nueva contraseña con token
/change-password    → Cambio obligatorio primer login

→ 404 personalizado

---

## 🌍 Internacionalización

El sistema soporta **español** e **inglés** con detección automática del idioma del navegador.

- Implementado con `react-i18next`
- Switch de idioma disponible en el header de ambos paneles
- Persiste la preferencia en `localStorage`
- Archivos de traducción en `frontend/src/i18n/`

---

## 📱 Responsividad

| Dispositivo | Navegación |
|---|---|
| Desktop (≥ 768px) | Sidebar lateral fijo |
| Móvil (< 768px) | Bottom navigation bar |

---

## 🔄 Flujo de Uso

### Alumno nuevo
1. El admin crea al alumno → contraseña inicial = matrícula
2. Alumno inicia sesión → sistema obliga cambiar contraseña
3. Alumno sube sus 4 documentos (Acta, CURP, Certificado, Constancia)
4. Admin recibe email de notificación
5. Admin revisa y aprueba o rechaza con motivo
6. Alumno recibe email con el resultado

### Recuperación de contraseña
1. Alumno ingresa su matrícula en `/recuperar`
2. Sistema envía email con link válido por 1 hora
3. Alumno define nueva contraseña en `/reset-password`

---

## 🛠️ Tecnologías adicionales

- **Dark mode**: implementado con TailwindCSS + clase `dark` en `<html>`
- **Skeletons**: loading states en todas las listas
- **Toasts**: feedback visual en todas las acciones
- **Modales**: confirmación de acciones destructivas con doble confirmación
- **Zona de peligro**: acciones críticas de estado y eliminación visualmente diferenciadas

---

## 👨‍💻 Desarrollado para

**Universidad Tecnológica de Nayarit**
Proyecto escolar — Sistema de Gestión de Expedientes Digitales

---

*Paperless System © 2025 — UTN*
