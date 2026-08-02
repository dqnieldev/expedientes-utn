package com.paperless.utn.wear.service

import com.google.android.gms.wearable.DataEvent
import com.google.android.gms.wearable.DataEventBuffer
import com.google.android.gms.wearable.DataMapItem
import com.google.android.gms.wearable.WearableListenerService
import com.paperless.utn.wear.notification.WearNotificationHelper

class WearDataListenerService : WearableListenerService() {

    override fun onDataChanged(dataEvents: DataEventBuffer) {
        for (event in dataEvents) {
            if (event.type == DataEvent.TYPE_CHANGED) {
                val path = event.dataItem.uri.path
                if (path == "/expediente_status") {
                    val dataMap = DataMapItem.fromDataItem(event.dataItem).dataMap
                    val alumno = dataMap.getString("alumno_nombre") ?: "Alumno"
                    val estado = dataMap.getString("estado_general") ?: "EN_REVISION"
                    val aprobados = dataMap.getInt("aprobados", 0)
                    val total = dataMap.getInt("total", 0)

                    val mensaje = "Expediente de $alumno: $estado ($aprobados/$total aprobados)"
                    WearNotificationHelper.enviarNotificacionExpediente(
                        context = this,
                        titulo = "📋 Dictamen Actualizado",
                        mensaje = mensaje
                    )
                }
            }
        }
    }
}
