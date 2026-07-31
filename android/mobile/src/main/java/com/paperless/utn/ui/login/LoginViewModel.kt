package com.paperless.utn.ui.login

import android.app.Application
import android.util.Patterns
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
        checkSession()
    }

    fun checkSession() {
        if (tokenManager.isLoggedIn()) {
            val savedEmail = tokenManager.getEmail() ?: ""
            val role = tokenManager.getRole() ?: ""
            uiState = LoginUiState.Success(savedEmail, role)
        } else {
            uiState = LoginUiState.Idle
        }
    }

    fun onEmailChange(newEmail: String) {
        email = newEmail
        if (uiState is LoginUiState.Error) {
            uiState = LoginUiState.Idle
        }
    }

    fun onPasswordChange(newPassword: String) {
        password = newPassword
        if (uiState is LoginUiState.Error) {
            uiState = LoginUiState.Idle
        }
    }

    private fun isValidEmail(target: String): Boolean {
        return Patterns.EMAIL_ADDRESS.matcher(target).matches()
    }

    fun onLoginClick() {
        val cleanEmail = email.trim()
        val cleanPassword = password.trim()

        if (cleanEmail.isEmpty()) {
            uiState = LoginUiState.Error("Por favor ingresa tu correo electrónico")
            return
        }

        if (!isValidEmail(cleanEmail)) {
            uiState = LoginUiState.Error("Ingresa un correo electrónico válido (ej. usuario@utnay.edu.mx)")
            return
        }

        if (cleanPassword.isEmpty()) {
            uiState = LoginUiState.Error("Por favor ingresa tu contraseña")
            return
        }

        if (cleanPassword.length < 6) {
            uiState = LoginUiState.Error("La contraseña debe tener al menos 6 caracteres")
            return
        }

        viewModelScope.launch {
            uiState = LoginUiState.Loading
            try {
                val response = apiService.login(LoginRequest(cleanEmail, cleanPassword))
                if (response.isSuccessful && response.body() != null) {
                    val body = response.body()!!
                    tokenManager.saveToken(body.token, body.user.email, body.user.role)
                    uiState = LoginUiState.Success(body.user.email, body.user.role)
                } else {
                    val errorMsg = when (response.code()) {
                        400, 401 -> "Credenciales incorrectas. Verifica tu correo y contraseña."
                        429 -> "Demasiados intentos. Intenta más tarde."
                        else -> "Credenciales incorrectas o usuario no registrado."
                    }
                    uiState = LoginUiState.Error(errorMsg)
                }
            } catch (e: Exception) {
                uiState = LoginUiState.Error("No se pudo conectar con el servidor. Revisa tu conexión a Internet.")
            }
        }
    }

    fun logout() {
        tokenManager.clearSession()
        email = ""
        password = ""
        uiState = LoginUiState.Idle
    }
}
