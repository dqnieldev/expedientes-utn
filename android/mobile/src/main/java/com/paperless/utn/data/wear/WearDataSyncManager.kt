package com.paperless.utn.data.wear

import android.content.Context
import com.google.android.gms.wearable.PutDataMapRequest
import com.google.android.gms.wearable.Wearable
import com.google.gson.Gson
import com.paperless.utn.data.model.AlumnoDto
import com.paperless.utn.data.model.DocumentoDto

data class AlumnoWearData(
    val id: Int,
    val nombre: String,
    val matricula: String,
    val carrera: String,
    val aprobados: Int,
    val enRevision: Int,
    val rechazados: Int,
    val pendientes: Int,
    val total: Int = 4
)

object WearDataSyncManager {

    private val gson = Gson()

    /**
     * Sincroniza la información del expediente del alumno activo en sesión móvil con el reloj Wear OS.
     */
    fun sincronizarExpedienteAlumno(
        context: Context,
        alumnoNombre: String,
        matricula: String,
        aprobados: Int,
        enRevision: Int,
        rechazados: Int,
        pendientes: Int,
        total: Int
    ) {
        try {
            val putDataMapReq = PutDataMapRequest.create("/expediente_status")
            val dataMap = putDataMapReq.dataMap

            dataMap.putString("role", "ALUMNO")
            dataMap.putString("alumno_nombre", alumnoNombre)
            dataMap.putString("matricula", matricula)
            dataMap.putInt("aprobados", aprobados)
            dataMap.putInt("en_revision", enRevision)
            dataMap.putInt("rechazados", rechazados)
            dataMap.putInt("pendientes", pendientes)
            dataMap.putInt("total", maxOf(total, 4))
            dataMap.putLong("timestamp", System.currentTimeMillis())

            val putDataReq = putDataMapReq.asPutDataRequest().setUrgent()
            Wearable.getDataClient(context).putDataItem(putDataReq)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    /**
     * Sincroniza la lista real de todos los alumnos de la institución en sesión Admin con el reloj Wear OS.
     */
    fun sincronizarDatosAdmin(
        context: Context,
        alumnos: List<AlumnoDto>,
        documentos: List<DocumentoDto>
    ) {
        try {
            val wearAlumnos = alumnos.map { al ->
                val docsAlumno = documentos.filter { it.alumno?.id == al.id || al.documentos?.any { d -> d.id == it.id } == true }
                val docsList = if (docsAlumno.isNotEmpty()) docsAlumno else al.documentos ?: emptyList()
                
                var apr = 0
                var rev = 0
                var rec = 0
                var pen = 0

                docsList.forEach { doc ->
                    when (doc.estado.uppercase()) {
                        "APROBADO" -> apr++
                        "EN_REVISION" -> rev++
                        "RECHAZADO" -> rec++
                        else -> pen++
                    }
                }

                val tot = maxOf(docsList.size, 4)
                val missing = maxOf(0, tot - (apr + rev + rec + pen))
                pen += missing

                AlumnoWearData(
                    id = al.id,
                    nombre = al.nombre,
                    matricula = al.matricula,
                    carrera = al.carrera,
                    aprobados = apr,
                    enRevision = rev,
                    rechazados = rec,
                    pendientes = pen,
                    total = tot
                )
            }

            val alumnosJson = gson.toJson(wearAlumnos)

            val putDataMapReq = PutDataMapRequest.create("/expediente_status")
            val dataMap = putDataMapReq.dataMap

            dataMap.putString("role", "ADMIN")
            dataMap.putString("alumnos_json", alumnosJson)
            dataMap.putLong("timestamp", System.currentTimeMillis())

            val putDataReq = putDataMapReq.asPutDataRequest().setUrgent()
            Wearable.getDataClient(context).putDataItem(putDataReq)
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
