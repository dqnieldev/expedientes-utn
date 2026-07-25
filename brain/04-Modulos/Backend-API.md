# Backend / API existente

Base para todo lo nuevo: Android, Wear OS y el módulo de analítica consumen o leen de aquí.

## Auth
```
POST   /api/auth/login
POST   /api/auth/change-password      # requiere token
POST   /api/auth/forgot-password      # { matricula }
POST   /api/auth/reset-password       # { token, newPassword }
```

## Alumnos
```
GET    /api/alumnos                   # ADMIN — todos
POST   /api/alumnos                   # ADMIN — crear
GET    /api/alumnos/me                # ALUMNO — perfil propio
GET    /api/alumnos/:id               # ADMIN — por ID
PUT    /api/alumnos/:id               # ADMIN — actualizar
DELETE /api/alumnos/:id               # ADMIN — eliminar permanente
PATCH  /api/alumnos/:id/estado        # ADMIN — cambiar estado
PUT    /api/alumnos/perfil            # ALUMNO — editar perfil propio
PUT    /api/alumnos/foto              # ALUMNO — cambiar foto
```

## Documentos
```
GET    /api/documentos                # ADMIN — todos
GET    /api/documentos/:alumnoId      # por alumno
POST   /api/documentos                # subir (PDF, máx 5MB)
PUT    /api/documentos/:id            # actualizar estado + razonRechazo
```

## Respaldos
```
GET    /api/backups
POST   /api/backups/crear
DELETE /api/backups/:filename
GET    /api/backups/descargar/:filename
GET    /api/backups/scheduler
POST   /api/backups/scheduler
```

## Reportes
```
GET    /api/reportes/general          # PDF todos los alumnos
GET    /api/reportes/alumno/:id       # PDF expediente individual
```

## Auditoría
```
GET    /api/audit?page=1&limit=50&accion=LOGIN
```

## Seguridad ya implementada
JWT (expira 8h) · bcrypt salt 10 · helmet · CORS restringido · rate-limit (5 intentos → bloqueo 15 min) · express-validator · logs morgan + AuditLog · sesión por inactividad (30 min)

## Gaps para lo nuevo de este cuatrimestre
- No hay endpoint de notificaciones push/websocket → Android tendrá que hacer polling (ver [[App-Android]])
- No hay endpoint de exportación de datos crudos para analítica → decidir si el módulo de analítica lee directo de Postgres o si se agrega un endpoint `/api/analitica/dataset`
