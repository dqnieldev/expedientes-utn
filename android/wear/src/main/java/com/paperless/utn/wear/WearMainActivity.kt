package com.paperless.utn.wear

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.os.Build
import android.os.Bundle
import android.os.Vibrator
import android.os.VibratorManager
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import androidx.wear.compose.material.Button
import androidx.wear.compose.material.ButtonDefaults
import androidx.wear.compose.material.Chip
import androidx.wear.compose.material.ChipDefaults
import androidx.wear.compose.material.MaterialTheme
import androidx.wear.compose.material.Text
import com.paperless.utn.wear.notification.WearNotificationHelper
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import kotlin.math.sqrt

class WearMainActivity : ComponentActivity(), SensorEventListener {

    private lateinit var sensorManager: SensorManager
    private var accelerometer: Sensor? = null
    private var lastShakeTime: Long = 0

    var shakeCount by mutableIntStateOf(0)
    var lastAccelValue by mutableFloatStateOf(0.0f)
    var lastNotificationInfo by mutableStateOf("Ninguna emitida")

    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted: Boolean ->
        if (isGranted) {
            Toast.makeText(this, "Permiso de Notificación concedido", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Solicitud de permiso dinámico para notificaciones en Android 13+ (API 33+)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                requestPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
            }
        }

        sensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
        accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)

        setContent {
            WearApp(
                shakeCount = shakeCount,
                lastAccel = lastAccelValue,
                lastNotificationInfo = lastNotificationInfo,
                onTestNotification = {
                    dispararNotificacionYVibracion("Probar Botón")
                }
            )
        }
    }

    private fun dispararNotificacionYVibracion(origen: String) {
        val horaActual = SimpleDateFormat("HH:mm:ss", Locale.getDefault()).format(Date())
        lastNotificationInfo = "Emitida a las $horaActual ($origen)"

        // 1. Respuesta Háptica de Vibración
        vibrateDevice(this)

        // 2. Mensaje Toast de Confirmación Visual
        Toast.makeText(this, "🔔 Notificación enviada ($origen)", Toast.LENGTH_SHORT).show()

        // 3. Notificación de Sistema Wear OS
        WearNotificationHelper.enviarNotificacionExpediente(
            context = this,
            titulo = "📋 Expediente Actualizado",
            mensaje = "Se ha validado la documentación técnica en producción ($origen)."
        )
    }

    override fun onResume() {
        super.onResume()
        accelerometer?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_UI)
        }
    }

    override fun onPause() {
        super.onPause()
        sensorManager.unregisterListener(this)
    }

    override fun onSensorChanged(event: SensorEvent?) {
        if (event != null && event.sensor.type == Sensor.TYPE_ACCELEROMETER) {
            val x = event.values[0]
            val y = event.values[1]
            val z = event.values[2]

            val acceleration = sqrt((x * x + y * y + z * z).toDouble()).toFloat() - SensorManager.GRAVITY_EARTH
            lastAccelValue = acceleration

            // Detectar gesto de agitación de muñeca (Wrist Shake Gesture)
            if (acceleration > 11.0f) {
                val now = System.currentTimeMillis()
                if (now - lastShakeTime > 1200) {
                    lastShakeTime = now
                    shakeCount++
                    dispararNotificacionYVibracion("Gesto Sensor")
                }
            }
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}

    private fun vibrateDevice(context: Context) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val vibratorManager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
                vibratorManager.defaultVibrator.vibrate(android.os.VibrationEffect.createOneShot(200, android.os.VibrationEffect.DEFAULT_AMPLITUDE))
            } else {
                @Suppress("DEPRECATION")
                val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
                vibrator.vibrate(200)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}

@Composable
fun WearApp(
    shakeCount: Int,
    lastAccel: Float,
    lastNotificationInfo: String,
    onTestNotification: () -> Unit
) {
    MaterialTheme {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFF004D2C)),
            contentAlignment = Alignment.Center
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(12.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                Text(
                    text = "📄 Paperless System",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(4.dp))

                Chip(
                    onClick = { },
                    label = {
                        Text(
                            text = "Expediente Completo",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    },
                    colors = ChipDefaults.chipColors(
                        backgroundColor = Color(0xFF00E680),
                        contentColor = Color(0xFF003820)
                    ),
                    modifier = Modifier.fillMaxWidth(0.95f)
                )

                Spacer(modifier = Modifier.height(4.dp))

                // Indicador del Sensor de Acelerómetro
                Text(
                    text = "Sensor: ${String.format("%.1f", lastAccel)} m/s² | Gestos: $shakeCount",
                    fontSize = 9.sp,
                    color = Color.White.copy(alpha = 0.85f),
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(4.dp))

                // Botón para probar Notificación Wear OS
                Button(
                    onClick = onTestNotification,
                    modifier = Modifier
                        .fillMaxWidth(0.9f)
                        .height(30.dp),
                    colors = ButtonDefaults.buttonColors(
                        backgroundColor = Color(0xFFFFC107),
                        contentColor = Color(0xFF003820)
                    )
                ) {
                    Text(
                        text = "🔔 Probar Notificación",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold
                    )
                }

                Spacer(modifier = Modifier.height(4.dp))

                // Confirmación visual de la última notificación/vibración
                Text(
                    text = "Notificación: $lastNotificationInfo",
                    fontSize = 8.sp,
                    color = Color.White.copy(alpha = 0.7f),
                    textAlign = TextAlign.Center
                )
            }
        }
    }
}
