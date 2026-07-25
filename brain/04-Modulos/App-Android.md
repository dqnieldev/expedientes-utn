# Módulo: App Android

Estado: por iniciar

## Objetivo
Cumplir [[Rubrica-Dispositivos-Inteligentes]] consumiendo [[Backend-API]].

## Pantallas mínimas
- Login (consume `POST /api/auth/login`, persiste el JWT)
- Panel alumno: lista de documentos + estado, perfil
- Panel admin: lista de documentos pendientes, aprobar/rechazar
- Navegación diferenciada según rol (leer el `role` del JWT/respuesta de login)

## Decisiones pendientes
- [ ] Lenguaje: Kotlin (recomendado, moderno) vs Java (ya usado en [[Puzzle-de-Formas]] anterior, más rápido de retomar)
- [ ] Cliente HTTP: Retrofit + OkHttp
- [ ] Actualización de estado: polling cada N segundos vs. pull-to-refresh manual
- [ ] Manejo de sesión: guardar JWT en `EncryptedSharedPreferences`

## Conexión con Wear OS
Ver [[Wear-OS]] — cuando el estado de un documento cambie a APROBADO/RECHAZADO, la app móvil reenvía el evento al reloj vía Wearable Data Layer API.
