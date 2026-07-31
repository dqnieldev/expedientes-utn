package com.paperless.utn.ui.expediente

import android.app.Application
import android.content.Context
import android.net.Uri
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.paperless.utn.data.model.AlumnoDto
import com.paperless.utn.data.model.DocumentoDto
import com.paperless.utn.data.remote.ApiClient
import com.paperless.utn.data.remote.TokenManager
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.toRequestBody

sealed interface ExpedienteUiState {
    object Loading : ExpedienteUiState
    data class SuccessAlumno(val alumno: AlumnoDto, val documentos: List<DocumentoDto>, val isUploading: Boolean = false) : ExpedienteUiState
    data class SuccessAdmin(val email: String, val role: String) : ExpedienteUiState
    data class Error(val message: String) : ExpedienteUiState
}

class ExpedienteViewModel(application: Application) : AndroidViewModel(application) {
    private val apiService = ApiClient.getService(application)
    private val tokenManager = TokenManager(application)

    var uiState by mutableStateOf<ExpedienteUiState>(ExpedienteUiState.Loading)
        private set

    fun cargarPerfilYDocumentos() {
        if (!tokenManager.isLoggedIn()) {
            uiState = ExpedienteUiState.Error("Sesión no iniciada")
            return
        }

        val role = tokenManager.getRole() ?: "ALUMNO"
        val email = tokenManager.getEmail() ?: ""

        if (role == "ADMIN" || role == "DEVELOPER") {
            uiState = ExpedienteUiState.SuccessAdmin(email, role)
            return
        }

        viewModelScope.launch {
            uiState = ExpedienteUiState.Loading
            try {
                val responsePerfil = apiService.getMiPerfil()
                if (responsePerfil.isSuccessful && responsePerfil.body() != null) {
                    val alumno = responsePerfil.body()!!
                    val responseDocs = apiService.getDocumentosByAlumnoId(alumno.id)
                    val docs = if (responseDocs.isSuccessful && responseDocs.body() != null) {
                        responseDocs.body()!!
                    } else {
                        alumno.documentos ?: emptyList()
                    }
                    uiState = ExpedienteUiState.SuccessAlumno(alumno, docs)
                } else if (responsePerfil.code() == 404) {
                    uiState = ExpedienteUiState.SuccessAdmin(email, role)
                } else {
                    uiState = ExpedienteUiState.Error("No se pudo obtener la información del expediente.")
                }
            } catch (e: Exception) {
                uiState = ExpedienteUiState.Error("No se pudo conectar con el servidor. Revisa tu conexión a Internet.")
            }
        }
    }

    fun subirDocumento(tipo: String, uri: Uri, context: Context) {
        val currentState = uiState
        if (currentState is ExpedienteUiState.SuccessAlumno) {
            uiState = currentState.copy(isUploading = true)
        }

        viewModelScope.launch {
            try {
                val contentResolver = context.contentResolver
                val inputStream = contentResolver.openInputStream(uri) ?: return@launch
                val fileBytes = inputStream.readBytes()
                inputStream.close()

                val mimeType = contentResolver.getType(uri) ?: "application/pdf"
                val extension = if (mimeType.contains("png")) ".png" else if (mimeType.contains("jpg") || mimeType.contains("jpeg")) ".jpg" else ".pdf"
                val fileName = "doc_${System.currentTimeMillis()}$extension"

                val requestFile = fileBytes.toRequestBody(mimeType.toMediaTypeOrNull())
                val filePart = MultipartBody.Part.createFormData("file", fileName, requestFile)
                val tipoBody = tipo.toRequestBody("text/plain".toMediaTypeOrNull())

                val response = apiService.uploadDocumento(tipoBody, filePart)
                if (response.isSuccessful) {
                    cargarPerfilYDocumentos()
                } else {
                    uiState = ExpedienteUiState.Error("No se pudo subir el archivo. Formato o tamaño no válido.")
                }
            } catch (e: Exception) {
                uiState = ExpedienteUiState.Error("Error al subir archivo: ${e.localizedMessage}")
            }
        }
    }

    fun logout() {
        tokenManager.clearSession()
        uiState = ExpedienteUiState.Loading
    }
}
