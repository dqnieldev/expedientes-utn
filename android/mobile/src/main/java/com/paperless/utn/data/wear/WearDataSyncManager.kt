package com.paperless.utn.data.wear

import android.content.Context
import com.google.android.gms.wearable.PutDataMapRequest
import com.google.android.gms.wearable.Wearable

object WearDataSyncManager {

    fun sincronizarExpedienteConWearable(
        context: Context,
        alumnoNombre: String,
        matricula: String,
        estadoGeneral: String,
        aprobados: Int,
        total: Int
    ) {
        try {
            val putDataMapReq = PutDataMapRequest.create("/expediente_status")
            val dataMap = putDataMapReq.dataMap

            dataMap.putString("alumno_nombre", alumnoNombre)
            dataMap.putString("matricula", matricula)
            dataMap.putString("estado_general", estadoGeneral)
            dataMap.putInt("aprobados", aprobados)
            dataMap.putInt("total", total)
            dataMap.putLong("timestamp", System.currentTimeMillis())

            val putDataReq = putDataMapReq.asPutDataRequest().setUrgent()
            Wearable.getDataClient(context).putDataItem(putDataReq)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
