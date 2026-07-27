# Módulo: Analítica (Extracción del Conocimiento)

Estado: Confirmado (Proyecto: Digitalización de Expedientes de Alumnos) — ver [[Rubrica-Extraccion-Conocimiento]]

## Módulo 1 — Supervisado (clasificación)
**Objetivo**: predecir si un documento será `APROBADO` o `RECHAZADO`.
**Variables candidatas**: `tipo` de documento, `carrera`, `cuatrimestre`, historial de rechazos previos del alumno, tiempo entre subida y revisión.
**Salida**: reporte de qué tipos de documento o carreras concentran más rechazos + gráfica de tasa de aprobación por categoría.

## Módulo 2 — No supervisado (clustering)
**Objetivo**: agrupar alumnos por patrones de comportamiento/riesgo.
**Variables candidatas**: `carrera`, `cuatrimestre`, `estado` (ACTIVO/BAJA/BAJA_TEMPORAL), frecuencia de `LOGIN_FALLIDO` en `AuditLog`, número de documentos rechazados.
**Salida**: gráfica de clusters + reporte de qué grupo de alumnos requiere seguimiento.

## Origen de los datos (Confirmado)
Consumo directo del dataset JSON exportado por la API REST vía endpoint `GET /api/analitica/dataset` implementado en la Fase 1.

## Stack sugerido
Python + pandas + scikit-learn + matplotlib/seaborn (o Plotly si se quiere interactivo)
