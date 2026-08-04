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
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import androidx.wear.compose.foundation.lazy.ScalingLazyColumn
import androidx.wear.compose.foundation.lazy.items
import androidx.wear.compose.material.*
import com.google.android.gms.wearable.DataClient
import com.google.android.gms.wearable.DataEventBuffer
import com.google.android.gms.wearable.DataMapItem
import com.google.android.gms.wearable.Wearable
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.paperless.utn.wear.notification.WearNotificationHelper
import kotlin.math.sqrt

data class AlumnoWearItem(
    val id: Int,
    val nombre: String,
    val matricula: String,
    val carrera: String,
    val aprobados: Int,
    val enRevision: Int,
    val rechazados: Int,
    val pendientes: Int,
    val total: Int = 4
)

class WearMainActivity : ComponentActivity(), SensorEventListener, DataClient.OnDataChangedListener {

    private lateinit var sensorManager: SensorManager
    private var accelerometer: Sensor? = null
    private var lastShakeTime: Long = 0

    var shakeCount by mutableIntStateOf(0)
    var lastAccelValue by mutableFloatStateOf(0.0f)
    var isDataSynced by mutableStateOf(false)
    var currentRole by mutableStateOf<String?>(null) // Null hasta recibir datos de la sesión móvil

    // Estado del Alumno Real en Sesión Móvil
    var alumnoNombre by mutableStateOf("")
    var matricula by mutableStateOf("")
    var aprobadosCount by mutableIntStateOf(0)
    var enRevisionCount by mutableIntStateOf(0)
    var rechazadosCount by mutableIntStateOf(0)
    var pendientesCount by mutableIntStateOf(0)
    var totalCount by mutableIntStateOf(4)

    // Lista de Alumnos Reales en Sesión Administrador
    var listaAlumnosReales = mutableStateListOf<AlumnoWearItem>()
    var selectedAlumnoForAdmin by mutableStateOf<AlumnoWearItem?>(null)

    private val gson = Gson()

    private val requestPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted: Boolean ->
        if (isGranted) {
            Toast.makeText(this, "Permisos concedidos", Toast.LENGTH_SHORT).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                requestPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
            }
        }

        sensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
        accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)

        setContent {
            WearAppMain(
                isDataSynced = isDataSynced,
                role = currentRole,
                alumnoNombre = selectedAlumnoForAdmin?.nombre ?: alumnoNombre,
                matricula = selectedAlumnoForAdmin?.matricula ?: matricula,
                aprobados = selectedAlumnoForAdmin?.aprobados ?: aprobadosCount,
                enRevision = selectedAlumnoForAdmin?.enRevision ?: enRevisionCount,
                rechazados = selectedAlumnoForAdmin?.rechazados ?: rechazadosCount,
                pendientes = selectedAlumnoForAdmin?.pendientes ?: pendientesCount,
                total = selectedAlumnoForAdmin?.total ?: totalCount,
                alumnosLista = listaAlumnosReales,
                selectedAlumno = selectedAlumnoForAdmin,
                onSelectAlumno = { alumno -> selectedAlumnoForAdmin = alumno },
                onBackToList = { selectedAlumnoForAdmin = null }
            )
        }
    }

    override fun onResume() {
        super.onResume()
        accelerometer?.let {
            sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_UI)
        }
        Wearable.getDataClient(this).addListener(this)
    }

    override fun onPause() {
        super.onPause()
        sensorManager.unregisterListener(this)
        Wearable.getDataClient(this).removeListener(this)
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

                    // 1. Enviar mensaje de sincronización para que el celular vibre y recargue datos
                    enviarMensajeSyncAlTelefono()

                    // 2. Notificación local y respuesta háptica en el reloj
                    dispararNotificacionYVibracion("Gesto de Movimiento")
                }
            }
        }
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}

    override fun onDataChanged(dataEvents: DataEventBuffer) {
        for (event in dataEvents) {
            if (event.dataItem.uri.path == "/expediente_status") {
                val dataMap = DataMapItem.fromDataItem(event.dataItem).dataMap
                val isLoggedIn = dataMap.getBoolean("is_logged_in", false)
                val roleReceived = dataMap.getString("role", "UNAUTHENTICATED")

                if (!isLoggedIn || roleReceived == "UNAUTHENTICATED") {
                    // MANEJO AUTOMÁTICO DE CIERRE DE SESIÓN DESDE EL MÓVIL
                    currentRole = null
                    isDataSynced = false
                    selectedAlumnoForAdmin = null
                    listaAlumnosReales.clear()
                    return
                }

                currentRole = roleReceived
                isDataSynced = true

                if (roleReceived == "ADMIN" || roleReceived == "DEVELOPER") {
                    val json = dataMap.getString("alumnos_json")
                    if (!json.isNullOrBlank()) {
                        val type = object : TypeToken<List<AlumnoWearItem>>() {}.type
                        val list: List<AlumnoWearItem> = gson.fromJson(json, type)
                        listaAlumnosReales.clear()
                        listaAlumnosReales.addAll(list)
                    }
                } else {
                    alumnoNombre = dataMap.getString("alumno_nombre", alumnoNombre)
                    matricula = dataMap.getString("matricula", matricula)
                    aprobadosCount = dataMap.getInt("aprobados", aprobadosCount)
                    enRevisionCount = dataMap.getInt("en_revision", enRevisionCount)
                    rechazadosCount = dataMap.getInt("rechazados", rechazadosCount)
                    pendientesCount = dataMap.getInt("pendientes", pendientesCount)
                    totalCount = dataMap.getInt("total", totalCount)

                    // Notificación háptica en reloj al recibir actualización real de dictamen
                    WearNotificationHelper.enviarNotificacionExpediente(
                        context = this,
                        titulo = "Expediente Sincronizado",
                        mensaje = "$alumnoNombre: $aprobadosCount/$totalCount documentos aprobados."
                    )
                }
            }
        }
    }

    private fun enviarMensajeSyncAlTelefono() {
        Wearable.getNodeClient(this).connectedNodes.addOnSuccessListener { nodes ->
            for (node in nodes) {
                Wearable.getMessageClient(this).sendMessage(node.id, "/shake_gesture_sync", byteArrayOf())
            }
        }
    }

    private fun dispararNotificacionYVibracion(origen: String) {
        vibrateDevice(this)
        Toast.makeText(this, "Sincronizando: $origen", Toast.LENGTH_SHORT).show()

        WearNotificationHelper.enviarNotificacionExpediente(
            context = this,
            titulo = "Expediente Digital",
            mensaje = "Actualización recibida vía $origen."
        )
    }

    private fun vibrateDevice(context: Context) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val vibratorManager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
                vibratorManager.defaultVibrator.vibrate(android.os.VibrationEffect.createOneShot(250, android.os.VibrationEffect.DEFAULT_AMPLITUDE))
            } else {
                @Suppress("DEPRECATION")
                val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
                vibrator.vibrate(250)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}

@Composable
fun WearAppMain(
    isDataSynced: Boolean,
    role: String?,
    alumnoNombre: String,
    matricula: String,
    aprobados: Int,
    enRevision: Int,
    rechazados: Int,
    pendientes: Int,
    total: Int,
    alumnosLista: List<AlumnoWearItem>,
    selectedAlumno: AlumnoWearItem?,
    onSelectAlumno: (AlumnoWearItem) -> Unit,
    onBackToList: () -> Unit
) {
    MaterialTheme {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFF0F172A)), // Carbón Oscuro Pastel Elegante
            contentAlignment = Alignment.Center
        ) {
            if (!isDataSynced || role == null || role == "UNAUTHENTICATED") {
                // PANTALLA DE ESPERA AL CERRAR SESIÓN O AL ESPERAR CONEXIÓN
                Column(
                    modifier = Modifier.padding(16.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text(
                        text = "Expediente Digital",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF34D399) // Verde Menta Soft
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    CircularProgressIndicator(
                        modifier = Modifier.size(24.dp)
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "Esperando inicio de sesión...",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Medium,
                        color = Color.White,
                        textAlign = TextAlign.Center
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = "Inicia sesión en la App Móvil",
                        fontSize = 9.sp,
                        color = Color(0xFF94A3B8),
                        textAlign = TextAlign.Center
                    )
                }
            } else if (role == "ADMIN" || role == "DEVELOPER") {
                if (selectedAlumno == null) {
                    // VISTA ADMINISTRADOR: LISTA DE ALUMNOS REALES DESDE LA BASE DE DATOS
                    ScalingLazyColumn(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(horizontal = 8.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        item {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(
                                    text = "Administración",
                                    fontSize = 12.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFFFBBF24) // Amarillo Pastel Warm
                                )
                                Text(
                                    text = "Alumnos (${alumnosLista.size})",
                                    fontSize = 9.sp,
                                    color = Color(0xFF94A3B8)
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                            }
                        }

                        items(alumnosLista) { alumno ->
                            Chip(
                                onClick = { onSelectAlumno(alumno) },
                                label = {
                                    Column {
                                        Text(text = alumno.nombre, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                        Text(text = "${alumno.aprobados}/${alumno.total} aprobados", fontSize = 9.sp, color = Color(0xFF34D399))
                                    }
                                },
                                colors = ChipDefaults.chipColors(
                                    backgroundColor = Color(0xFF1E293B),
                                    contentColor = Color.White
                                ),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(vertical = 2.dp)
                            )
                        }
                    }
                } else {
                    // DETALLE DE ALUMNO SELECCIONADO POR EL ADMINISTRADOR EN EL RELOJ
                    ExpedienteDonutWearView(
                        title = alumnoNombre.take(16),
                        aprobados = aprobados,
                        enRevision = enRevision,
                        rechazados = rechazados,
                        pendientes = pendientes,
                        total = total,
                        showBackButton = true,
                        onBackToList = onBackToList
                    )
                }
            } else {
                // VISTA ALUMNO REAL: MUESTRA NÚNICAMENTE LA DONA DEL ALUMNO EN SESIÓN
                ExpedienteDonutWearView(
                    title = "Expediente Digital",
                    aprobados = aprobados,
                    enRevision = enRevision,
                    rechazados = rechazados,
                    pendientes = pendientes,
                    total = total,
                    showBackButton = false,
                    onBackToList = { }
                )
            }
        }
    }
}

@Composable
private fun ExpedienteDonutWearView(
    title: String,
    aprobados: Int,
    enRevision: Int,
    rechazados: Int,
    pendientes: Int,
    total: Int,
    showBackButton: Boolean,
    onBackToList: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(8.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = title,
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = Color.White,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(4.dp))

        // DONA DIBUJADA CON CANVAS EN WEAR OS
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier.size(72.dp)
        ) {
            Canvas(modifier = Modifier.size(68.dp)) {
                val strokeWidth = 8.dp.toPx()
                val tot = if (total > 0) total.toFloat() else 4f

                val sweepAprobados = (aprobados / tot) * 360f
                val sweepEnRevision = (enRevision / tot) * 360f
                val sweepRechazados = (rechazados / tot) * 360f
                val sweepPendientes = 360f - (sweepAprobados + sweepEnRevision + sweepRechazados)

                var startAngle = -90f

                if (sweepAprobados > 0) {
                    drawArc(Color(0xFF10B981), startAngle, sweepAprobados, false, style = Stroke(strokeWidth))
                    startAngle += sweepAprobados
                }
                if (sweepEnRevision > 0) {
                    drawArc(Color(0xFFF59E0B), startAngle, sweepEnRevision, false, style = Stroke(strokeWidth))
                    startAngle += sweepEnRevision
                }
                if (sweepRechazados > 0) {
                    drawArc(Color(0xFFF43F5E), startAngle, sweepRechazados, false, style = Stroke(strokeWidth))
                    startAngle += sweepRechazados
                }
                if (sweepPendientes > 0) {
                    drawArc(Color(0xFFCBD5E1), startAngle, sweepPendientes, false, style = Stroke(strokeWidth))
                }
            }

            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Text(
                    text = "$aprobados/$total",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.White
                )
                Text(
                    text = "docs",
                    fontSize = 8.sp,
                    color = Color(0xFF94A3B8)
                )
            }
        }

        Spacer(modifier = Modifier.height(4.dp))

        // CONTADORES RESUMIDOS CON PALETA PASTEL SOFISTICADA
        Row(
            horizontalArrangement = Arrangement.spacedBy(4.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            BadgePill(count = aprobados, color = Color(0xFF10B981), label = "Apr")
            BadgePill(count = enRevision, color = Color(0xFFF59E0B), label = "Rev")
            BadgePill(count = rechazados, color = Color(0xFFF43F5E), label = "Obs")
        }

        Spacer(modifier = Modifier.height(4.dp))

        if (showBackButton) {
            Button(
                onClick = onBackToList,
                modifier = Modifier
                    .fillMaxWidth(0.8f)
                    .height(24.dp),
                colors = ButtonDefaults.buttonColors(backgroundColor = Color(0xFF334155))
            ) {
                Text("Volver a Lista", fontSize = 8.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
private fun BadgePill(count: Int, color: Color, label: String) {
    Row(
        modifier = Modifier
            .background(color, shape = androidx.compose.foundation.shape.RoundedCornerShape(6.dp))
            .padding(horizontal = 4.dp, vertical = 2.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(text = "$label: $count", fontSize = 8.sp, fontWeight = FontWeight.Bold, color = Color.White)
    }
}
