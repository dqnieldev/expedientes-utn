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
import com.paperless.utn.data.model.DictamenRequest
import com.paperless.utn.data.model.DocumentoDto
import com.paperless.utn.data.remote.ApiClient
import com.paperless.utn.data.remote.TokenManager
import com.paperless.utn.data.wear.WearDataSyncManager
import kotlinx.coroutines.launch
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.MultipartBody
import okhttp3.RequestBody.Companion.toRequestBody

sealed interface ExpedienteUiState {
    object Loading : ExpedienteUiState
    data class SuccessAlumno(val alumno: AlumnoDto, val documentos: List<DocumentoDto>, val isUploading: Boolean = false) : ExpedienteUiState
    data class SuccessAdmin(
        val email: String,
        val role: String,
        val alumnos: List<AlumnoDto>,
        val documentos: List<DocumentoDto>,
        val isActionLoading: Boolean = false
    ) : ExpedienteUiState
    data class Error(val message: String) : ExpedienteUiState
}

class ExpedienteViewModel(application: Application) : AndroidViewModel(application) {
    private val apiService = ApiClient.getService(application)
    private val tokenManager = TokenManager(application)

    var uiState by mutableStateOf<ExpedienteUiState>(ExpedienteUiState.Loading)
        private set

    var searchQuery by mutableStateOf("")
    var filtroEstado by mutableStateOf("TODOS")
    var selectedAlumnoIdFilter by mutableStateOf<Int?>(null)

    init {
        cargarPerfilYDocumentos()
    }

    fun seleccionarAlumnoFiltro(alumnoId: Int?) {
        selectedAlumnoIdFilter = alumnoId
    }

    fun cargarPerfilYDocumentos() {
        if (!tokenManager.isLoggedIn()) {
            uiState = ExpedienteUiState.Error("Sesión no iniciada")
            return
        }

        val role = tokenManager.getRole() ?: "ALUMNO"
        val email = tokenManager.getEmail() ?: ""

        viewModelScope.launch {
            uiState = ExpedienteUiState.Loading
            if (role == "ADMIN" || role == "DEVELOPER") {
                cargarDatosAdmin(email, role)
                return@launch
            }

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

                    // Sincronizar estado del expediente con el reloj Wear OS via DataClient API
                    WearDataSyncManager.sincronizarExpedienteConWearable(
                        context = getApplication(),
                        alumnoNombre = alumno.nombre,
                        matricula = alumno.matricula,
                        estadoGeneral = if (docs.isNotEmpty() && docs.all { it.estado == "APROBADO" }) "APROBADO" else "EN_REVISION",
                        aprobados = docs.count { it.estado == "APROBADO" },
                        total = docs.size
                    )
                } else if (responsePerfil.code() == 404) {
                    cargarDatosAdmin(email, role)
                } else {
                    uiState = ExpedienteUiState.Error("No se pudo obtener la información del expediente.")
                }
            } catch (e: Exception) {
                uiState = ExpedienteUiState.Error("No se pudo conectar con el servidor. Revisa tu conexión a Internet.")
            }
        }
    }

    private suspend fun cargarDatosAdmin(email: String, role: String) {
        try {
            val respAlumnos = apiService.getAllAlumnos()
            val respDocs = apiService.getAllDocumentos()

            val alumnos = if (respAlumnos.isSuccessful) respAlumnos.body() ?: emptyList() else emptyList()
            val documentos = if (respDocs.isSuccessful) respDocs.body() ?: emptyList() else emptyList()

            uiState = ExpedienteUiState.SuccessAdmin(email, role, alumnos, documentos)
        } catch (e: Exception) {
            uiState = ExpedienteUiState.SuccessAdmin(email, role, emptyList(), emptyList())
        }
    }

    fun dictaminarDocumento(docId: Int, estado: String, razonRechazo: String?) {
        val currentState = uiState
        if (currentState !is ExpedienteUiState.SuccessAdmin) return

        viewModelScope.launch {
            uiState = currentState.copy(isActionLoading = true)
            try {
                val req = DictamenRequest(estado = estado, razonRechazo = razonRechazo)
                val resp = apiService.dictaminarDocumento(docId, req)
                if (resp.isSuccessful) {
                    cargarPerfilYDocumentos()
                } else {
                    uiState = currentState.copy(isActionLoading = false)
                }
            } catch (e: Exception) {
                uiState = currentState.copy(isActionLoading = false)
            }
        }
    }

    fun subirDocumento(tipo: String, uri: Uri, context: Context) {
        val currentState = uiState
        if (currentState !is ExpedienteUiState.SuccessAlumno) return

        viewModelScope.launch {
            uiState = currentState.copy(isUploading = true)
            try {
                val contentResolver = context.contentResolver
                val inputStream = contentResolver.openInputStream(uri) ?: throw Exception("Archivo no accesible")
                val byteArray = inputStream.readBytes()
                inputStream.close()

                val requestFile = byteArray.toRequestBody(
                    contentResolver.getType(uri)?.toMediaTypeOrNull() ?: "application/pdf".toMediaTypeOrNull()
                )

                val bodyFile = MultipartBody.Part.createFormData("archivo", "documento_$tipo.pdf", requestFile)
                val bodyTipo = tipo.toRequestBody("text/plain".toMediaTypeOrNull())

                val response = apiService.uploadDocumento(bodyTipo, bodyFile)
                if (response.isSuccessful) {
                    cargarPerfilYDocumentos()
                } else {
                    uiState = currentState.copy(isUploading = false)
                }
            } catch (e: Exception) {
                uiState = currentState.copy(isUploading = false)
            }
        }
    }

    fun logout() {
        tokenManager.clearSession()
    }
}
