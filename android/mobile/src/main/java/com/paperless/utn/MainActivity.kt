package com.paperless.utn

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.paperless.utn.data.remote.TokenManager
import com.paperless.utn.ui.expediente.ExpedienteScreen
import com.paperless.utn.ui.expediente.ExpedienteViewModel
import com.paperless.utn.ui.login.LoginScreen
import com.paperless.utn.ui.login.LoginViewModel
import com.paperless.utn.ui.theme.PaperlessTheme

class MainActivity : ComponentActivity() {

    private val loginViewModel: LoginViewModel by viewModels()
    private val expedienteViewModel: ExpedienteViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate()

        val tokenManager = TokenManager(this)
        val startDestination = if (tokenManager.isLoggedIn()) "expediente" else "login"

        setContent {
            PaperlessTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    AppNavigation(
                        startDestination = startDestination,
                        loginViewModel = loginViewModel,
                        expedienteViewModel = expedienteViewModel
                    )
                }
            }
        }
    }
}

@Composable
fun AppNavigation(
    startDestination: String,
    loginViewModel: LoginViewModel,
    expedienteViewModel: ExpedienteViewModel
) {
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = startDestination) {
        composable("login") {
            LoginScreen(
                viewModel = loginViewModel,
                onLoginSuccess = {
                    expedienteViewModel.cargarPerfilYDocumentos()
                    navController.navigate("expediente") {
                        popUpTo("login") { inclusive = true }
                    }
                }
            )
        }

        composable("expediente") {
            ExpedienteScreen(
                viewModel = expedienteViewModel,
                onLogout = {
                    navController.navigate("login") {
                        popUpTo("expediente") { inclusive = true }
                    }
                }
            )
        }
    }
}
