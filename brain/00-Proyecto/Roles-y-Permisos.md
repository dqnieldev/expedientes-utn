# Roles y permisos

El sistema ya define tres roles (`enum Role` en Prisma). Toda nueva interfaz (web o Android) debe respetar estos permisos, no inventar unos nuevos.

## 🎓 ALUMNO
- Accede a su panel personal (`GET /api/alumnos/me`)
- Sube y reemplaza documentos (solo PDF, máx 5MB)
- Consulta el estado de cada documento
- Edita su perfil (datos personales, domicilio, contraseña, foto)
- Recibe notificaciones por email al ser aprobado/rechazado un documento

## 🛡️ ADMIN
- Gestión completa de alumnos (crear, editar, eliminar)
- Valida documentos (aprobar/rechazar con motivo)
- Cambia estado de alumno (ACTIVO / BAJA / BAJA_TEMPORAL)
- Genera reportes PDF (general y por alumno)
- Recibe notificación cuando un alumno sube un documento

## 💻 DEVELOPER
- Gestión completa de respaldos (crear, programar, eliminar)
- Vista de logs de auditoría (logins, errores, validaciones, rechazos)
- Gestión de usuarios administradores (crear, eliminar)

## Relevancia para Android (Dispositivos Inteligentes)
La rúbrica pide "al menos dos roles con permisos diferenciados" — usar ALUMNO y ADMIN cubre el requisito directamente sin inventar nada. DEVELOPER es opcional para el móvil.
