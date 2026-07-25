# Flujo de validación de documentos

## Estados de un documento (`EstadoDocumento`)
`PENDIENTE` → `EN_REVISION` → `APROBADO` | `RECHAZADO`

## Reglas
- Un alumno solo puede tener un documento por `tipo` (`@@unique([alumnoId, tipo])`)
- Rechazar un documento requiere `razonRechazo`
- Cada cambio de estado dispara: notificación por email al alumno + registro en `AuditLog`

## Acciones auditadas relacionadas
- `APROBAR_DOCUMENTO`
- `RECHAZAR_DOCUMENTO`
- `ACTUALIZAR_DOCUMENTO`

## Relevancia para módulos nuevos
- **Android**: este es el evento que debe reflejarse en la app del alumno (y potencialmente disparar la notificación en Wear OS)
- **Analítica**: este es el campo objetivo (`estado`) para el modelo supervisado de [[Modulo-Analitica]]
