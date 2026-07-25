# Rúbrica — Dispositivos Inteligentes (Android + Wear OS)

| # | Requerimiento | Aspectos a evaluar | Valor |
|---|---|---|---|
| 1 | Inicio de sesión | Pantalla de autenticación funcional, validación de credenciales, manejo de errores, persistencia de sesión, cierre de sesión | 15% |
| 2 | Roles de usuario | Al menos 2 roles (o los existentes en el sistema web), control de acceso y permisos diferenciados | 15% |
| 3 | Interfaz por rol | Interfaces diferenciadas según el rol; organización, navegación, UX | 20% |
| 4 | Consulta y visualización | Listas, tablas, tarjetas, indicadores o gráficas, información clara y ordenada | 20% |
| 5 | Diseño de la app móvil | Usabilidad, consistencia visual, navegación intuitiva, componentes Android, adaptación a pantallas | 10% |
| 6 | Integración con Wear OS | App para Wear OS integrada con la app móvil, intercambio de información entre ambos | 5% |
| 7 | Notificaciones en Wear OS | Al menos una notificación funcional relacionada con el sistema | 10% |
| 8 | Uso de sensores del Wear OS | Al menos un sensor (acelerómetro, contador de pasos, frecuencia cardíaca, gestos, etc.) | 5% |

## Mapeo a la API existente
Ver [[Backend-API]] para los endpoints exactos. Resumen:
- Login → `POST /api/auth/login`
- Roles → ALUMNO / ADMIN ya existen en el sistema
- Interfaz alumno → `GET /api/alumnos/me` + documentos propios
- Interfaz admin → `GET /api/documentos` para validar
- Consulta/visualización → estado de documentos, o base de `GET /api/reportes/general`

## Pendiente de decidir
- [ ] Mecanismo de actualización en tiempo real (polling vs. endpoint nuevo) — ver [[App-Android]]
- [ ] Qué sensor de Wear OS usar (no depende del dominio, puede ser independiente)
- [ ] Qué evento dispara la notificación en Wear OS (propuesta: cambio de estado de documento)
