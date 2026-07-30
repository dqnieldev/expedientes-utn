package com.paperless.utn.data.model

import com.google.gson.annotations.SerializedName

data class AlumnoDto(
    @SerializedName("id") val id: Int,
    @SerializedName("nombre") val nombre: String,
    @SerializedName("matricula") val matricula: String,
    @SerializedName("carrera") val carrera: String,
    @SerializedName("cuatrimestre_actual") val cuatrimestreActual: Int,
    @SerializedName("estado") val estado: String,
    @SerializedName("foto") val foto: String?,
    @SerializedName("documentos") val documentos: List<DocumentoDto>?
)

data class DocumentoDto(
    @SerializedName("id") val id: Int,
    @SerializedName("tipo") val tipo: String, // ACTA_NACIMIENTO, CURP, CERTIFICADO, CONSTANCIA
    @SerializedName("url") val url: String,
    @SerializedName("estado") val estado: String, // PENDIENTE, EN_REVISION, APROBADO, RECHAZADO
    @SerializedName("razonRechazo") val razonRechazo: String?,
    @SerializedName("createdAt") val createdAt: String?
)
