# Paperless System — Aplicación Móvil Android & Wear OS Companion

Este directorio contiene la solución móvil empresarial de **Paperless System (`expedientes-utn`)** compuesta por dos módulos nativos desarrollados en **Kotlin + Jetpack Compose**:

- **`:mobile`**: Aplicación móvil principal para dispositivos Android (teléfonos y tablets).
- **`:wear`**: Módulo companion optimizado para relojes inteligentes **Wear OS 3.0+** con soporte para Tiles y Complicaciones.

---

## 🚀 Guía de Apertura y Ejecución en Android Studio

1. **Abrir el proyecto**:
   - Abre **Android Studio**.
   - Selecciona **Open** y navega hasta la carpeta `expedientes-utn/android`.
   - Espera a que Gradle termine de sincronizar las dependencias (`Sync Project with Gradle Files`).

2. **Ejecutar la Aplicación Móvil (`:mobile`)**:
   - En la barra superior de Android Studio, selecciona la configuración de ejecución **`mobile`**.
   - Elige tu dispositivo físico o emulador (API 26 o superior).
   - Haz clic en el botón **Run ▶**.

3. **Ejecutar el Módulo Wear OS (`:wear`)**:
   - Selecciona la configuración de ejecución **`wear`**.
   - Elige un emulador **Wear OS Small/Large Round** (API 30 o superior).
   - Haz clic en **Run ▶**.

---

## 🔒 Conexión con la API de Producción

La aplicación se conecta automáticamente al backend desplegado en Render:
- **URL Base**: `https://expedientes-utn-backend.onrender.com/`
- **Autenticación**: JSON Web Tokens (JWT) persistidos en almacenamiento seguro `paperless_secure_prefs`.
