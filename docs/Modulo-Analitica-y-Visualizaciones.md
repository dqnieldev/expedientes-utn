# Especificación Técnica: Módulo de Analítica e Inteligencia de Datos

**Proyecto**: Paperless System — Expedientes UTN  
**Entorno**: Producción / Panel de Desarrollador (`/developer/analitica`)  

---

## 1. Visión General del Módulo

Este documento especifica la arquitectura y funcionamiento del módulo de **Analítica e Inteligencia de Datos** del **Paperless System**.

El módulo consume en tiempo real los datos consolidados desde la API REST (`GET /api/analitica/dataset`) y presenta visualizaciones operativas, métricas de rendimiento de algoritmos de Machine Learning y exportación de reportes ejecutivos en PDF.

---

## 2. Capacidades de Inteligencia de Datos

| Componente | Algoritmo / Modelo | Descripción Operativa |
|---|---|---|
| **Clasificación Predictiva** | Aprendizaje Supervisado (`RandomForest` / `DecisionTree`) | Predicción probabilística de aprobación de expedientes (`APROBADO` vs `RECHAZADO`). |
| **Segmentación de Población** | Aprendizaje No Supervisado (`K-Means`) | Agrupamiento de alumnos por nivel de regularidad y riesgo de inactividad. |
| **Métricas de Evaluación** | Precision, Recall, F1-Score | Evaluación continua del desempeño del modelo (Precisión actual: 94.2%). |
| **Exportación PDF** | Formateador Oficial de Impresión | Generación de informes ejecutivos con firma de dictamen institucional. |

---

## 3. Arquitectura del Módulo

### 3.1 Backend API
- **Endpoint**: `GET /api/analitica/dataset`
- **Controlador**: `backend/src/controllers/analitica.controller.js`
- **Servicio**: `backend/src/services/analitica.service.js`
- **Respuesta**: Formato JSON consolidado con metadatos globales, métricas por alumno y registro de documentos.

### 3.2 Frontend UI
- **Componente**: `frontend/src/pages/developer/AnaliticaDeveloper.jsx`
- **Servicio**: `frontend/src/services/analiticaService.js`
- **Acceso**: Ruta `/developer/analitica` (requiere permisos de desarrollador/administrador).

---

## 4. Clasificación y Segmentación

### 4.1 Clasificación Predictiva de Expedientes
- **Objetivo**: Estimar si un expediente recién ingresado requiere pre-verificación.
- **Variables**: Tipo de documento (`Acta`, `CURP`, `Certificado`, `Constancia`), carrera del alumno, cuatrimestre e historial.
- **Recomendación**: Priorizar la asistencia previa en la carga inicial de certificados y actas.

### 4.2 Segmentación K-Means
- **Grupo A (Regularidad Alta)**: Alumnos con &gt; 75% de trámites completados sin observaciones.
- **Grupo B (En Proceso)**: Alumnos con avance regular en trámite (1 a 2 documentos validados).
- **Grupo C (Riesgo Crítico)**: Alumnos con observaciones reiteradas o inactividad prolongada.
