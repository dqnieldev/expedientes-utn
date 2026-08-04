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

    private val refreshReceiver = object : android.content.BroadcastReceiver() {
        override fun onReceive(context: android.content.Context?, intent: android.content.Intent?) {
            if (intent?.action == "com.paperless.utn.ACTION_REFRESH_EXPEDIENTE") {
                android.widget.Toast.makeText(this@MainActivity, "Sincronizando expediente con Smartwatch", android.widget.Toast.LENGTH_SHORT).show()
                expedienteViewModel.cargarPerfilYDocumentos()
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

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

    override fun onResume() {
        super.onResume()
        val filter = android.content.IntentFilter("com.paperless.utn.ACTION_REFRESH_EXPEDIENTE")
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.TIRAMISU) {
            registerReceiver(refreshReceiver, filter, RECEIVER_EXPORTED)
        } else {
            registerReceiver(refreshReceiver, filter)
        }
    }

    override fun onPause() {
        super.onPause()
        try {
            unregisterReceiver(refreshReceiver)
        } catch (e: Exception) {
            e.printStackTrace()
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
                    expedienteViewModel.logout()
                    loginViewModel.logout()
                    navController.navigate("login") {
                        popUpTo("expediente") { inclusive = true }
                    }
                }
            )
        }
    }
}
