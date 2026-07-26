# Especificación de Web Services y Principios de Codificación Segura

**Proyecto**: Paperless System — Expedientes UTN  
**Asignatura**: Desarrollo Web Integral  
**Institución**: Universidad Tecnológica de Nayarit — IDGS-91  

---

## 1. Especificación de Principios de Codificación Segura

El sistema implementa defensas en profundidad siguiendo los estándares recomendados por **OWASP Top 10** y mejores prácticas de desarrollo web seguro:

### 1.1 Protección de Cabeceras HTTP (Helmet)
Se utiliza la librería `helmet` para configurar de manera transparente las cabeceras HTTP de seguridad:
- `X-DNS-Prefetch-Control`: Previene la resolución anticipada de DNS.
- `X-Frame-Options`: Configurado en `SAMEORIGIN` / `DENY` para evitar ataques de Clickjacking.
- `X-Content-Type-Options`: Configurado en `nosniff` para evitar la adivinación MIME (MIME sniffing).
- `Cross-Origin-Resource-Policy`: Restringe la carga de recursos estáticos entre orígenes.

### 1.2 Control de Autenticación y Criptografía
- **Hashing de Contraseñas**: Todas las contraseñas de usuarios se almacenan encriptadas con `bcrypt` / `bcryptjs` utilizando un factor de costo (salt rounds) de **10**. Las contraseñas en texto plano nunca se registran ni persisten.
- **Tokens de Sesión (JWT)**: Autenticación mediante JSON Web Tokens firmados criptográficamente mediante el algoritmo `HS256` con una clave secreta (`JWT_SECRET`) y un tiempo de vida (TTL) de **8 horas**.

### 1.3 Prevención de Ataques de Fuerza Bruta (Rate Limiting)
- Se aplica el middleware `express-rate-limit` en la ruta crítica `/api/auth/login`.
- **Regla**: Tras **5 intentos fallidos** de inicio de sesión desde la misma dirección IP en una ventana de 15 minutos, el servidor bloquea temporalmente solicitudes adicionales devolviendo el código `HTTP 429 Too Many Requests`.

### 1.4 Sanitización y Validación de Entradas
- Uso sistemático de `express-validator` en todos los puntos de entrada para mitigar inyecciones de código (SQL Injection, Command Injection y XSS).
- Normalización y sanitización estricta de cadenas de texto y correos electrónicos.

### 1.5 Auditoría e Inmutabilidad de Eventos
- Registro centralizado en la tabla `AuditLog` y archivo inmutable `logs/audit.log` para todas las acciones sensibles (`LOGIN`, `LOGIN_FALLIDO`, `APROBAR_DOCUMENTO`, `RECHAZAR_DOCUMENTO`, `CAMBIAR_ESTADO_ALUMNO`, `CREAR_BACKUP`).

---

## 2. Especificación Formal de Web Services (API REST)

| Módulo | Método | Endpoint | Roles Permitidos | Descripción | Payload Requ. | Resp. Éxito |
|---|---|---|---|---|---|---|
| **Auth** | `POST` | `/api/auth/login` | Público | Autenticación de usuario | `{ matricula, password }` | `200 OK` + JWT |
| **Auth** | `POST` | `/api/auth/change-password` | Autenticado | Cambio de contraseña | `{ currentPassword, newPassword }` | `200 OK` |
| **Alumnos** | `GET` | `/api/alumnos` | `ADMIN` | Lista todos los alumnos | Ninguno | `200 OK` [Array] |
| **Alumnos** | `GET` | `/api/alumnos/me` | `ALUMNO` | Perfil del alumno autenticado | Ninguno | `200 OK` {Alumno} |
| **Alumnos** | `POST` | `/api/alumnos` | `ADMIN` | Alta de nuevo alumno | `{ nombre, matricula, carrera... }` | `201 Created` |
| **Documentos** | `GET` | `/api/documentos` | `ADMIN` | Lista general de documentos | Ninguno | `200 OK` [Array] |
| **Documentos** | `POST` | `/api/documentos` | `ALUMNO` | Subida de expediente | `multipart/form-data` (PDF max 5MB) | `201 Created` |
| **Documentos** | `PUT` | `/api/documentos/:id` | `ADMIN` | Dictamen (Aprobar/Rechazar) | `{ estado, razonRechazo }` | `200 OK` |
| **Analítica** | `GET` | `/api/analitica/dataset` | `ADMIN`, `DEVELOPER` | Extracción de dataset para ML | Ninguno | `200 OK` {JSON} |
| **Respaldos** | `GET` | `/api/backups` | `DEVELOPER` | Lista respaldos ZIP de la BD | Ninguno | `200 OK` [Array] |
| **Auditoría** | `GET` | `/api/audit` | `DEVELOPER` | Consulta de logs paginados | `?page=1&limit=50` | `200 OK` {logs} |

---

## 3. Demostración de Pruebas de Software (Exposición)

Para la presentación académica, se han preparado los casos de prueba ejecutables en el directorio `backend/tests/`:

1. **Prueba de Caja Blanca** (`tests/caja-blanca/auth.middleware.test.js`):
   - Evalúa la cobertura estructural interna de los middlewares `verifyToken` y `authorizeRoles`.
   - Garantiza que la ramificación lógica ante tokens expirados, firmas alteradas o falta de rol responda con los códigos HTTP 401 y 403 adecuados.

2. **Prueba de Caja Negra** (`tests/caja-negra/api-endpoints.test.js`):
   - Evalúa el comportamiento funcional del sistema como una "caja cerrada" realizando peticiones HTTP de extremo a extremo (E2E).
   - Valida la respuesta del servidor ante entradas inválidas o desautorizadas.
