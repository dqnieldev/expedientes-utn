# Módulo: Analítica (Extracción del Conocimiento)

Estado: por confirmar tipo de proyecto asignado — ver [[Rubrica-Extraccion-Conocimiento]]

## Propuesta módulo 1 — Supervisado (clasificación)
**Objetivo**: predecir si un documento será `APROBADO` o `RECHAZADO`.
**Variables candidatas**: `tipo` de documento, `carrera`, `cuacuatrimestre_actual`, historial de rechazos previos del alumno, tiempo entre subida y revisión.
**Salida**: reporte de qué tipos de documento o carreras concentran más rechazos + gráfica de tasa de aprobación por categoría.

## Propuesta módulo 2 — No supervisado (clustering)
**Objetivo**: agrupar alumnos por patrones de comportamiento/riesgo.
**Variables candidatas**: `carrera`, `cuacuatrimestre_actual`, `estado` (ACTIVO/BAJA/BAJA_TEMPORAL), frecuencia de `LOGIN_FALLIDO` en `AuditLog`, número de documentos rechazados.
**Salida**: gráfica de clusters + reporte de qué grupo de alumnos requiere seguimiento.

## Origen de los datos
Dos opciones a decidir:
1. Conexión directa a Postgres (solo lectura) desde el script de analítica
2. Exportar un dataset vía nuevo endpoint `GET /api/analitica/dataset` en el backend

## Stack sugerido
Python + pandas + scikit-learn + matplotlib/seaborn (o Plotly si se quiere interactivo)
