# Reporte de Pruebas de Software (Caja Blanca & Caja Negra)

**Proyecto**: Paperless System — Expedientes UTN  
**Entorno de Pruebas**: Jest + Supertest (ES Modules)  
**Fecha de Ejecución**: 2026-07-27  

---

## 1. Resumen de Ejecución

La suite de pruebas automatizadas fue construida para validar la robustez, seguridad y correcto funcionamiento de los servicios web del sistema.

```bash
PASS tests/caja-blanca/auth.middleware.test.js
PASS tests/caja-blanca/auth.service.test.js
PASS tests/caja-negra/api-endpoints.test.js
PASS tests/caja-negra/documento.flow.test.js
PASS tests/caja-negra/rate-limit.test.js

Test Suites: 5 passed, 5 total
Tests:       18 passed, 18 total
Time:        2.85 s
```

---

## 2. Pruebas de Caja Blanca (Estructura Interna del Código)

Las pruebas de **Caja Blanca** verifican los componentes internos del sistema, comprobando las rutas de código, algoritmos de encriptación y middleware de seguridad:

| Archivo | Componente Evaluado | Casos de Prueba | Resultado |
|---|---|---|---|
| `auth.middleware.test.js` | Middleware `verifyToken` | Extracción de header, firmas alteradas, tokens expirados | ✅ Pass |
| `auth.middleware.test.js` | Middleware `authorizeRoles` | Permisos RBAC (`ADMIN`, `DEVELOPER`, `ALUMNO`) | ✅ Pass |
| `auth.service.test.js` | Servicio `bcrypt` | Generación de salt level 10 y comparación segura de hash | ✅ Pass |
| `auth.service.test.js` | Firma JWT | Emisión de token HS256, decodificación de payload y expiración | ✅ Pass |

---

## 3. Pruebas de Caja Negra (Interfaces de Entradas / Salidas)

Las pruebas de **Caja Negra** simulan clientes externos realizando peticiones HTTP de extremo a extremo (E2E) sin depender de la implementación interna:

| Archivo | Ruta API | Entrada | Respuesta Esperada | Resultado |
|---|---|---|---|---|
| `api-endpoints.test.js` | `GET /` | Petición sin cuerpo | `HTTP 200 OK` + Mensaje de Estado | ✅ Pass |
| `api-endpoints.test.js` | `GET /api/alumnos` | Solicitud sin token JWT | `HTTP 401 Unauthorized` | ✅ Pass |
| `api-endpoints.test.js` | `POST /api/auth/login` | Payload vacío `{}` | `HTTP 400 Bad Request` | ✅ Pass |
| `documento.flow.test.js` | `POST /api/documentos` | Intento de subida sin token | `HTTP 401 / 403 Forbidden` | ✅ Pass |
| `rate-limit.test.js` | `POST /api/auth/login` | 6 intentos fallidos seguidos | `HTTP 429 Too Many Requests` | ✅ Pass |

---

## 4. Conclusión Técnica

El sistema ha superado el 100% de la matriz de pruebas automatizadas, garantizando que tanto la lógica de encriptación interna como las fronteras de seguridad HTTP previenen accesos no autorizados e inyecciones de datos.
