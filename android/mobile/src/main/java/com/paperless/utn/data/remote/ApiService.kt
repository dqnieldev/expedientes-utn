package com.paperless.utn.data.remote

import com.paperless.utn.data.model.AlumnoDto
import com.paperless.utn.data.model.DictamenRequest
import com.paperless.utn.data.model.DocumentoDto
import com.paperless.utn.data.model.LoginRequest
import com.paperless.utn.data.model.LoginResponse
import okhttp3.MultipartBody
import okhttp3.RequestBody
import retrofit2.Response
import retrofit2.http.*

interface ApiService {

    @POST("api/auth/login")
    suspend fun login(
        @Body request: LoginRequest
    ): Response<LoginResponse>

    @GET("api/alumnos/me")
    suspend fun getMiPerfil(): Response<AlumnoDto>

    @GET("api/alumnos")
    suspend fun getAllAlumnos(): Response<List<AlumnoDto>>

    @GET("api/documentos")
    suspend fun getAllDocumentos(): Response<List<DocumentoDto>>

    @GET("api/documentos/{id}")
    suspend fun getDocumentosByAlumnoId(
        @Path("id") id: Int
    ): Response<List<DocumentoDto>>

    @Multipart
    @POST("api/documentos")
    suspend fun uploadDocumento(
        @Part("tipo") tipo: RequestBody,
        @Part file: MultipartBody.Part
    ): Response<DocumentoDto>

    @PUT("api/documentos/{id}")
    suspend fun dictaminarDocumento(
        @Path("id") id: Int,
        @Body request: DictamenRequest
    ): Response<DocumentoDto>

    @Multipart
    @PUT("api/alumnos/foto")
    suspend fun uploadFoto(
        @Part foto: MultipartBody.Part
    ): Response<AlumnoDto>
}
