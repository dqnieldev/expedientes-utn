# Módulo expedientes (cuatrimestre anterior)

Construido y funcionando. Base sobre la que se agrega todo lo nuevo.

## Flujo de uso — alumno nuevo
1. El admin crea al alumno → contraseña inicial = matrícula
2. Alumno inicia sesión → sistema obliga a cambiar contraseña
3. Alumno sube sus 4 documentos (Acta, CURP, Certificado, Constancia)
4. Admin recibe email de notificación
5. Admin revisa y aprueba o rechaza con motivo
6. Alumno recibe email con el resultado

## Recuperación de contraseña
1. Alumno ingresa su matrícula en `/recuperar`
2. Sistema envía email con link válido por 1 hora
3. Alumno define nueva contraseña en `/reset-password`

## Navegación web existente

**Panel alumno**
- `/dashboard` → resumen + documentos
- `/documentos` → subir y gestionar documentos
- `/perfil` → editar datos personales y contraseña

**Panel admin**
- `/admin/dashboard` → métricas + alumnos recientes
- `/admin/alumnos` → CRUD de alumnos
- `/admin/alumnos/:id` → detalle + expediente + zona de peligro
- `/admin/documentos` → validar documentos
- `/admin/respaldos` → gestión de respaldos
- `/admin/auditoria` → logs de auditoría

Ver [[Flujo-Validacion]] para el detalle del ciclo de vida de un documento y [[Esquema-Prisma]] para el modelo de datos completo.
