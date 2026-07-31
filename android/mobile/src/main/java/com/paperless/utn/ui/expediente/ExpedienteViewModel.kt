package com.paperless.utn.ui.expediente

import android.app.Application
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

sealed interface ExpedienteUiState {
    object Loading : ExpedienteUiState
    data class Success(val alumno: AlumnoDto, val documentos: List<DocumentoDto>) : ExpedienteUiState
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
                    uiState = ExpedienteUiState.Success(alumno, docs)
                } else {
                    val errorMsg = if (responsePerfil.code() == 403) {
                        "Acceso restringido: Esta vista es para alumnos registrados."
                    } else {
                        "No se pudo obtener la información del expediente (${responsePerfil.code()})"
                    }
                    uiState = ExpedienteUiState.Error(errorMsg)
                }
            } catch (e: Exception) {
                uiState = ExpedienteUiState.Error("Error al conectar: ${e.localizedMessage}")
            }
        }
    }

    fun logout() {
        tokenManager.clearSession()
        uiState = ExpedienteUiState.Loading
    }
}
