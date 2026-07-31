package com.paperless.utn.ui.login

import android.app.Application
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.paperless.utn.data.model.LoginRequest
import com.paperless.utn.data.remote.ApiClient
import com.paperless.utn.data.remote.TokenManager
import kotlinx.coroutines.launch

sealed interface LoginUiState {
    object Idle : LoginUiState
    object Loading : LoginUiState
    data class Success(val email: String, val role: String) : LoginUiState
    data class Error(val message: String) : LoginUiState
}

class LoginViewModel(application: Application) : AndroidViewModel(application) {
    private val apiService = ApiClient.getService(application)
    private val tokenManager = TokenManager(application)

    var email by mutableStateOf("")
    var password by mutableStateOf("")
    var uiState by mutableStateOf<LoginUiState>(LoginUiState.Idle)
        private set

    init {
        if (tokenManager.isLoggedIn()) {
            val savedEmail = tokenManager.getEmail() ?: ""
            val role = tokenManager.getRole() ?: ""
            uiState = LoginUiState.Success(savedEmail, role)
        }
    }

    fun onLoginClick() {
        if (email.isBlank() || password.isBlank()) {
            uiState = LoginUiState.Error("Por favor ingresa tu correo y contraseña")
            return
        }

        viewModelScope.launch {
            uiState = LoginUiState.Loading
            try {
                val response = apiService.login(LoginRequest(email.trim(), password.trim()))
                if (response.isSuccessful && response.body() != null) {
                    val body = response.body()!!
                    tokenManager.saveToken(body.token, body.user.email, body.user.role)
                    uiState = LoginUiState.Success(body.user.email, body.user.role)
                } else {
                    val errorMsg = if (response.code() == 401) {
                        "Correo o contraseña incorrectos"
                    } else if (response.code() == 429) {
                        "Demasiados intentos. Intenta más tarde."
                    } else {
                        "Error de autenticación (${response.code()})"
                    }
                    uiState = LoginUiState.Error(errorMsg)
                }
            } catch (e: Exception) {
                uiState = LoginUiState.Error("Error de conexión: ${e.localizedMessage ?: "Servidor no disponible"}")
            }
        }
    }

    fun logout() {
        tokenManager.clearSession()
        uiState = LoginUiState.Idle
    }
}
