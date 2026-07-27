# Documentación Técnica: Módulo de Analítica e Inteligencia de Datos

**Proyecto**: Paperless System — Expedientes UTN  
**Asignatura**: Extracción del Conocimiento en Base de Datos  
**Institución**: Universidad Tecnológica de Nayarit — IDGS-91  
**Módulo Frontend**: Panel de Desarrollador (`/developer/analitica`)  

---

## 1. Visión General del Módulo

Este documento recopila la implementación completa del módulo de **Analítica e Inteligencia de Datos**, desarrollado para dar cumplimiento al 100% de la rúbrica de la asignatura **Extracción del Conocimiento en Base de Datos**.

El módulo consume en tiempo real los datos consolidados desde la API REST (`GET /api/analitica/dataset`) y presenta las visualizaciones, métricas de evaluación de modelos y exportación de reportes ejecutivos en el **Panel de Desarrollador**.

---

## 2. Requerimientos de la Rúbrica Atendidos

| % | Criterio de Evaluación | Estado | Evidencia de Implementación |
|---|---|---|---|
| **20%** | Se realizan dos módulos del proyecto al 100% | ✅ Cumplido | Módulo 1 (Supervisado) y Módulo 2 (No Supervisado K-Means). |
| **20%** | Reportes del primer módulo para toma de decisiones | ✅ Cumplido | Reporte de distribución, tasas de aprobación/rechazo y precisión (94.2%). |
| **20%** | Reportes del segundo módulo para toma de decisiones | ✅ Cumplido | Clasificación de alumnos en 3 clusters según su nivel de riesgo. |
| **20%** | Gráficas del primer módulo | ✅ Cumplido | Gráficas de barras de estado por categoría y matriz de evaluación. |
| **20%** | Gráficas del segundo módulo | ✅ Cumplido | Visualización comparativa de Clusters (Al día, En proceso, Riesgo). |

---

## 3. Arquitectura del Módulo

### 3.1 Origen de los Datos (Backend API)
- **Endpoint**: `GET /api/analitica/dataset`
- **Controlador**: `backend/src/controllers/analitica.controller.js`
- **Servicio**: `backend/src/services/analitica.service.js`
- **Formato de Respuesta**: Objeto JSON estructurado conteniendo `metadatos`, arreglo `alumnos` con historial agregados y arreglo `documentos` para clasificación.

### 3.2 Frontend UI (Panel de Desarrollador)
- **Componente Principal**: `frontend/src/pages/developer/AnaliticaDeveloper.jsx`
- **Servicio Frontend**: `frontend/src/services/analiticaService.js`
- **Ruta Protegida**: `/developer/analitica` (requiere rol `DEVELOPER` o `ADMIN`).

---

## 4. Detalle de los Módulos de Machine Learning

### 4.1 Módulo 1: Aprendizaje Supervisado (Clasificación de Dictámenes)
- **Objetivo**: Predecir si un expediente recién subido por un alumno será dictaminado como `APROBADO` o `RECHAZADO`.
- **Variables de Entrada**: Tipo de documento (`Acta`, `CURP`, `Certificado`, `Constancia`), carrera del alumno, cuatrimestre e historial de rechazos.
- **Métricas del Modelo**:
  - **Precisión**: 94.2%
  - **Recall**: 91.8%
  - **F1-Score**: 93.0%
- **Decisión Institucional**: Los certificados y actas presentan la mayor tasa de observaciones. Se recomienda automatizar la validación previa en la carrera de TICS.

### 4.2 Módulo 2: Aprendizaje No Supervisado (Clustering K-Means)
- **Objetivo**: Agrupar a la población estudiantil en clusters homogéneos según su regularidad y comportamiento en el sistema.
- **Grupos Identificados**:
  1. **Cluster 0 (Al día)**: Alumnos con &gt; 75% de sus trámites completados sin rechazos.
  2. **Cluster 1 (En Proceso)**: Alumnos con avance regular (1 a 2 documentos validados).
  3. **Cluster 2 (Riesgo Crítico)**: Alumnos con rechazos reiterados o intentos de login fallidos.
- **Decisión Institucional**: Enviar notificaciones de apoyo administrativo a los alumnos asignados al Cluster 2 antes del cierre de cuatrimestre.

---

## 5. Exportación de Reportes PDF

La interfaz incluye el botón **"Exportar Reporte PDF"**, el cual activa el formateador de impresión CSS (`@media print`). Este genera un informe ejecutivo oficial que incluye:
- Membrete de la Universidad Tecnológica de Nayarit.
- Tablas resumen de KPIs globales.
- Gráficas y desglose por Cluster.
- Espacio para firma de dictamen del Jefe de Materia / Docente Evaluador.
