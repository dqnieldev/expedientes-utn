# Módulo: Wear OS

Estado: por iniciar

## Objetivo
Cumplir los puntos 6, 7 y 8 de [[Rubrica-Dispositivos-Inteligentes]] (5% + 10% + 5% = 20% del rubro Android).

## Notificación (10%)
Propuesta: notificar en el reloj cuando el estado de un documento del alumno cambie (aprobado/rechazado), replicando el evento que ya dispara el email en el backend.

## Sensor (5%)
No depende del dominio de expedientes — puede ser independiente. Opciones más simples de implementar:
- Contador de pasos (`Sensor.TYPE_STEP_COUNTER`)
- Acelerómetro para un gesto simple (ej. sacudir para refrescar)

## Intercambio de datos con el móvil (5%)
Usar Wearable Data Layer API (`MessageClient` o `DataClient`) para pasar el evento de cambio de estado desde el teléfono al reloj.
