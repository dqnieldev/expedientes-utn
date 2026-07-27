# Reglas de Contexto y Producción — Paperless System (`expedientes-utn`)

## 🚨 Regla Obligatoria: Contexto de Producción (Sin Etiquetas Académicas)

1. **Sin Términos Académicos en Interfaces ni Código**:
   - En ningún componente de la interfaz de usuario (UI), código fuente, comentarios o mensajes visuales se deben usar términos como: *"Módulo 5: Extracción de Conocimiento"*, *"Módulo 1/2"*, *"IDGS-91"*, *"Rúbrica Sec. X"*, *"Rúbrica de la materia"*, *"Jefe de materia"*, ni nombres de asignaturas escolares.
   - El sistema debe tratarse y presentarse **estrictamente como un software empresarial en producción** diseñado para desarrolladores, administradores e institución.

2. **Nomenclatura Enterprise Aprobada**:
   - Módulo de Analítica → **"Analítica e Inteligencia de Datos"** / **"Inteligencia Operativa & ML"**.
   - Módulo Supervisado → **"Clasificación Predictiva de Expedientes"**.
   - Módulo No Supervisado → **"Segmentación & Riesgo (Clustering K-Means)"**.
   - Grupos de Riesgo → **"Grupo A: Regularidad Alta"**, **"Grupo B: En Proceso Regular"**, **"Grupo C: Riesgo Crítico"**.
   - Documentos de la App → **"Documentación Técnica de Producción"** / **"Especificación de Arquitectura y Web Services"**.

3. **Mantenimiento**:
   - Aplicar esta regla a todas las presentes y futuras fases del proyecto (Web, Android, Wear OS y Analítica).

## 🌿 Regla de Control de Versiones en Git (Feature Branches)

1. **Uso Obligatorio de Ramas de Trabajo**:
   - Queda estrictamente prohibido realizar cambios o commits directamente en la rama `main`.
   - Antes de iniciar cualquier nueva funcionalidad o fase, se debe crear una rama específica con el prefijo correspondiente (ej. `git checkout -b feature/app-android-login`, `git checkout -b feature/wear-os-integration`).
   - Todos los avances, commits y verificaciones se realizarán en la rama de la funcionalidad antes de solicitar merge.

## 📋 Regla de Planificación y Aprobación Previa

1. **Presentación de Plan Antes de Modificar Código**:
   - Antes de escribir o modificar cualquier archivo de código, el asistente debe presentar el **Plan de Implementación** detallado en el chat / artefacto `implementation_plan.md`.
   - Se debe pausar y esperar la revisión y **aprobación explícita del usuario** antes de iniciar cualquier cambio en el código fuente.
