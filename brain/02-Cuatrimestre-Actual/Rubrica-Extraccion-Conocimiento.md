# Rúbrica — Extracción del Conocimiento en Base de Datos

**Grupo**: IDGS-91,92,93,94
**Entrega**: 3-4 agosto 2026
**Valor**: 60% de la calificación es cumplir el 100% de esta lista

## Unidad temática / temas a evaluar
- 3. Análisis supervisado → 3.2 Evaluación de modelos de aprendizaje supervisado
- 4. Análisis no supervisado → 4.1 Algoritmos de aprendizaje no supervisado, 4.2 Métricas de evaluación de modelos de procesamiento de datos
- 5. Presentación y visualización → 5.1 Técnicas de visualización, 5.2 Herramientas de visualización, 5.3 Bibliotecas de visualización (APIs)

## Objetivo
- Implementar algoritmos de análisis supervisado para predicción/clasificación de nuevas entradas
- Implementar algoritmos de análisis no supervisado para extraer características útiles de los conjuntos de datos
- Presentar información de manera gráfica para soportar toma de decisiones

## Lista de cotejo
| % | Criterio |
|---|---|
| 20% | Se realizan dos módulos del proyecto al 100% |
| 20% | Reportes del primer módulo con información relevante para toma de decisiones |
| 20% | Reportes del segundo módulo con información relevante para toma de decisiones |
| 20% | Gráfica a partir de información relevante del primer módulo |
| 20% | Gráfica a partir de información relevante del segundo módulo |

## ✅ Tipo de Proyecto Confirmado
**Dominio asignado**: *Digitalización y Gestión de Expedientes de Alumnos (Paperless System)*.
Los datos de entrenamiento e ingesta provienen directamente de la base de datos PostgreSQL a través del endpoint `GET /api/analitica/dataset` implementado en la Fase 1.

## Módulos de Analítica Definidos
Ver [[Modulo-Analitica]] para el detalle técnico:
- **Módulo 1 (Supervisado)**: Clasificación de dictamen de documentos (`APROBADO` vs `RECHAZADO`).
- **Módulo 2 (No Supervisado)**: Clustering (K-Means) de alumnos por carrera, cuatrimestre y actividad para detectar patrones de riesgo y seguimiento.
