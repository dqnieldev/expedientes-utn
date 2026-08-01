package com.paperless.utn.ui.expediente

import android.net.Uri
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AdminPanelSettings
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Error
import androidx.compose.material.icons.filled.ExitToApp
import androidx.compose.material.icons.filled.FileUpload
import androidx.compose.material.icons.filled.Group
import androidx.compose.material.icons.filled.HourglassTop
import androidx.compose.material.icons.filled.Pending
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.Topic
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.paperless.utn.data.model.AlumnoDto
import com.paperless.utn.data.model.DocumentoDto
import com.paperless.utn.ui.theme.AccentGold
import com.paperless.utn.ui.theme.AccentTeal
import com.paperless.utn.ui.theme.NavyPrimary
import com.paperless.utn.ui.theme.StatusDanger

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ExpedienteScreen(
    viewModel: ExpedienteViewModel,
    onLogout: () -> Unit
) {
    val uiState = viewModel.uiState

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Paperless System", color = Color.White, fontWeight = FontWeight.Bold) },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = NavyPrimary),
                actions = {
                    IconButton(onClick = { viewModel.cargarPerfilYDocumentos() }) {
                        Icon(Icons.Default.Refresh, contentDescription = "Actualizar", tint = Color.White)
                    }
                    IconButton(onClick = {
                        viewModel.logout()
                        onLogout()
                    }) {
                        Icon(Icons.Default.ExitToApp, contentDescription = "Cerrar Sesión", tint = Color.White)
                    }
                }
            )
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .background(MaterialTheme.colorScheme.background)
        ) {
            when (uiState) {
                is ExpedienteUiState.Loading -> {
                    CircularProgressIndicator(
                        modifier = Modifier.align(Alignment.Center),
                        color = NavyPrimary
                    )
                }
                is ExpedienteUiState.Error -> {
                    Column(
                        modifier = Modifier
                            .align(Alignment.Center)
                            .padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(
                            imageVector = Icons.Default.Error,
                            contentDescription = "Error",
                            tint = StatusDanger,
                            modifier = Modifier.size(48.dp)
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Text(
                            text = uiState.message,
                            color = MaterialTheme.colorScheme.onSurface,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Medium,
                            textAlign = TextAlign.Center
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Button(
                            onClick = { viewModel.cargarPerfilYDocumentos() },
                            colors = ButtonDefaults.buttonColors(containerColor = NavyPrimary)
                        ) {
                            Text("Reintentar")
                        }
                    }
                }
                is ExpedienteUiState.SuccessAlumno -> {
                    ExpedienteAlumnoContent(
                        alumno = uiState.alumno,
                        documentos = uiState.documentos,
                        isUploading = uiState.isUploading,
                        onUploadFile = { tipoKey, uri, context ->
                            viewModel.subirDocumento(tipoKey, uri, context)
                        }
                    )
                }
                is ExpedienteUiState.SuccessAdmin -> {
                    ExpedienteAdminDashboard(
                        email = uiState.email,
                        role = uiState.role,
                        alumnos = uiState.alumnos,
                        documentos = uiState.documentos,
                        isActionLoading = uiState.isActionLoading,
                        searchQuery = viewModel.searchQuery,
                        onSearchChange = { viewModel.searchQuery = it },
                        filtroEstado = viewModel.filtroEstado,
                        onFiltroEstadoChange = { viewModel.filtroEstado = it },
                        onDictaminar = { docId, estado, razon ->
                            viewModel.dictaminarDocumento(docId, estado, razon)
                        }
                    )
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun ExpedienteAdminDashboard(
    email: String,
    role: String,
    alumnos: List<AlumnoDto>,
    documentos: List<DocumentoDto>,
    isActionLoading: Boolean,
    searchQuery: String,
    onSearchChange: (String) -> Unit,
    filtroEstado: String,
    onFiltroEstadoChange: (String) -> Unit,
    onDictaminar: (Int, String, String?) -> Unit
) {
    var selectedTab by remember { mutableStateOf(0) }
    var docToReject by remember { mutableStateOf<DocumentoDto?>(null) }
    var razonInput by remember { mutableStateOf("") }

    if (docToReject != null) {
        AlertDialog(
            onDismissRequest = { docToReject = null },
            title = { Text("Registrar Observación", fontWeight = FontWeight.Bold) },
            text = {
                Column {
                    Text(
                        text = "Documento: ${getTipoLabel(docToReject!!.tipo)}",
                        fontSize = 13.sp,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    OutlinedTextField(
                        value = razonInput,
                        onValueChange = { razonInput = it },
                        label = { Text("Motivo de observación") },
                        modifier = Modifier.fillMaxWidth(),
                        singleLine = false,
                        maxLines = 3
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val doc = docToReject
                        if (doc != null && razonInput.isNotBlank()) {
                            onDictaminar(doc.id, "RECHAZADO", razonInput.trim())
                            docToReject = null
                            razonInput = ""
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = StatusDanger)
                ) {
                    Text("Observar Documento")
                }
            },
            dismissButton = {
                TextButton(onClick = { docToReject = null }) {
                    Text("Cancelar")
                }
            }
        )
    }

    Column(modifier = Modifier.fillMaxSize()) {
        TabRow(
            selectedTabIndex = selectedTab,
            containerColor = NavyPrimary,
            contentColor = Color.White
        ) {
            Tab(
                selected = selectedTab == 0,
                onClick = { selectedTab = 0 },
                text = { Text("Revisión & Dictamen", fontWeight = FontWeight.Bold) },
                icon = { Icon(Icons.Default.Topic, contentDescription = "Dictamen") }
            )
            Tab(
                selected = selectedTab == 1,
                onClick = { selectedTab = 1 },
                text = { Text("Alumnos (${alumnos.size})", fontWeight = FontWeight.Bold) },
                icon = { Icon(Icons.Default.Group, contentDescription = "Alumnos") }
            )
        }

        if (selectedTab == 0) {
            AdminDocumentosTab(
                email = email,
                role = role,
                documentos = documentos,
                searchQuery = searchQuery,
                onSearchChange = onSearchChange,
                filtroEstado = filtroEstado,
                onFiltroEstadoChange = onFiltroEstadoChange,
                onAprobar = { docId -> onDictaminar(docId, "APROBADO", null) },
                onRechazar = { doc ->
                    docToReject = doc
                    razonInput = ""
                }
            )
        } else {
            AdminAlumnosTab(
                alumnos = alumnos,
                searchQuery = searchQuery,
                onSearchChange = onSearchChange
            )
        }
    }
}

@Composable
private fun AdminDocumentosTab(
    email: String,
    role: String,
    documentos: List<DocumentoDto>,
    searchQuery: String,
    onSearchChange: (String) -> Unit,
    filtroEstado: String,
    onFiltroEstadoChange: (String) -> Unit,
    onAprobar: (Int) -> Unit,
    onRechazar: (DocumentoDto) -> Unit
) {
    val totalRevision = documentos.count { it.estado == "EN_REVISION" }
    val totalAprobados = documentos.count { it.estado == "APROBADO" }
    val totalRechazados = documentos.count { it.estado == "RECHAZADO" }

    val docsFiltrados = documentos.filter { doc ->
        val matchEstado = when (filtroEstado) {
            "EN_REVISION" -> doc.estado == "EN_REVISION"
            "APROBADO" -> doc.estado == "APROBADO"
            "RECHAZADO" -> doc.estado == "RECHAZADO"
            else -> true
        }
        val matchSearch = searchQuery.isBlank() ||
                (doc.alumno?.nombre?.contains(searchQuery, ignoreCase = true) == true) ||
                (doc.alumno?.matricula?.contains(searchQuery, ignoreCase = true) == true) ||
                (getTipoLabel(doc.tipo).contains(searchQuery, ignoreCase = true))

        matchEstado && matchSearch
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        modifier = Modifier.size(44.dp),
                        shape = CircleShape,
                        color = NavyPrimary
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(Icons.Default.AdminPanelSettings, contentDescription = null, tint = Color.White)
                        }
                    }
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(text = email, fontSize = 15.sp, fontWeight = FontWeight.Bold)
                        Text(
                            text = if (role == "ADMIN") "ADMINISTRADOR DEL SISTEMA" else "DESARROLLADOR",
                            fontSize = 11.sp,
                            color = AccentTeal,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }

        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                KpiCard(
                    title = "En Revisión",
                    count = totalRevision.toString(),
                    color = AccentGold,
                    modifier = Modifier.weight(1f)
                )
                KpiCard(
                    title = "Aprobados",
                    count = totalAprobados.toString(),
                    color = AccentTeal,
                    modifier = Modifier.weight(1f)
                )
                KpiCard(
                    title = "Observados",
                    count = totalRechazados.toString(),
                    color = StatusDanger,
                    modifier = Modifier.weight(1f)
                )
            }
        }

        item {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = onSearchChange,
                label = { Text("Buscar por alumno, matrícula o documento") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Buscar") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )
        }

        item {
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                val filtros = listOf(
                    "TODOS" to "Todos (${documentos.size})",
                    "EN_REVISION" to "En Revisión ($totalRevision)",
                    "APROBADO" to "Aprobados ($totalAprobados)",
                    "RECHAZADO" to "Observados ($totalRechazados)"
                )
                items(filtros) { (key, label) ->
                    FilterChip(
                        selected = filtroEstado == key,
                        onClick = { onFiltroEstadoChange(key) },
                        label = { Text(label, fontSize = 12.sp, fontWeight = FontWeight.SemiBold) }
                    )
                }
            }
        }

        item {
            Text(
                text = "Documentos Registrados (${docsFiltrados.size})",
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                color = NavyPrimary
            )
        }

        items(docsFiltrados) { doc ->
            AdminDocumentoItemCard(
                documento = doc,
                onAprobar = { onAprobar(doc.id) },
                onRechazar = { onRechazar(doc) }
            )
        }
    }
}

@Composable
private fun KpiCard(
    title: String,
    count: String,
    color: Color,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = color.copy(alpha = 0.12f))
    ) {
        Column(
            modifier = Modifier.padding(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(text = count, fontSize = 20.sp, fontWeight = FontWeight.Bold, color = color)
            Text(text = title, fontSize = 11.sp, fontWeight = FontWeight.Medium, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.8f))
        }
    }
}

@Composable
private fun AdminDocumentoItemCard(
    documento: DocumentoDto,
    onAprobar: () -> Unit,
    onRechazar: () -> Unit
) {
    val estado = documento.estado
    val (badgeColor, badgeText) = when (estado) {
        "APROBADO" -> Pair(AccentTeal, "APROBADO")
        "EN_REVISION" -> Pair(AccentGold, "EN REVISIÓN")
        "RECHAZADO" -> Pair(StatusDanger, "OBSERVADO")
        else -> Pair(Color.Gray, "PENDIENTE")
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = getTipoLabel(documento.tipo),
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )
                Surface(
                    color = badgeColor.copy(alpha = 0.15f),
                    shape = RoundedCornerShape(20.dp)
                ) {
                    Text(
                        text = badgeText,
                        color = badgeColor,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(6.dp))

            Text(
                text = "Alumno: ${documento.alumno?.nombre ?: "Sin nombre"}",
                fontSize = 13.sp,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.onSurface
            )

            Text(
                text = "Matrícula: ${documento.alumno?.matricula ?: "N/A"} — ${documento.alumno?.carrera ?: ""}",
                fontSize = 12.sp,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
            )

            if (estado == "RECHAZADO" && !documento.razonRechazo.isNullOrEmpty()) {
                Spacer(modifier = Modifier.height(8.dp))
                Surface(
                    color = StatusDanger.copy(alpha = 0.08f),
                    shape = RoundedCornerShape(6.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = "Observación: ${documento.razonRechazo}",
                        color = StatusDanger,
                        fontSize = 12.sp,
                        modifier = Modifier.padding(8.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Button(
                    onClick = onAprobar,
                    colors = ButtonDefaults.buttonColors(containerColor = AccentTeal),
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Icon(Icons.Default.Check, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Aprobar", fontSize = 12.sp)
                }

                Button(
                    onClick = onRechazar,
                    colors = ButtonDefaults.buttonColors(containerColor = StatusDanger),
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(8.dp)
                ) {
                    Icon(Icons.Default.Close, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Observar", fontSize = 12.sp)
                }
            }
        }
    }
}

@Composable
private fun AdminAlumnosTab(
    alumnos: List<AlumnoDto>,
    searchQuery: String,
    onSearchChange: (String) -> Unit
) {
    val alumnosFiltrados = alumnos.filter { al ->
        searchQuery.isBlank() ||
                al.nombre.contains(searchQuery, ignoreCase = true) ||
                al.matricula.contains(searchQuery, ignoreCase = true) ||
                al.carrera.contains(searchQuery, ignoreCase = true)
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = onSearchChange,
                label = { Text("Buscar alumno por nombre o matrícula") },
                leadingIcon = { Icon(Icons.Default.Search, contentDescription = "Buscar") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp)
            )
        }

        item {
            Text(
                text = "Directorio de Alumnos (${alumnosFiltrados.size})",
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                color = NavyPrimary
            )
        }

        items(alumnosFiltrados) { al ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        modifier = Modifier.size(48.dp),
                        shape = CircleShape,
                        color = NavyPrimary
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text(
                                text = al.nombre.take(1).uppercase(),
                                color = Color.White,
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    Spacer(modifier = Modifier.width(12.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Text(text = al.nombre, fontSize = 15.sp, fontWeight = FontWeight.Bold)
                        Text(text = "Matrícula: ${al.matricula}", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f))
                        Text(text = "${al.carrera} — Cuatrimestre ${al.cuatrimestreActual}", fontSize = 11.sp, color = AccentTeal)
                    }

                    Surface(
                        color = if (al.estado == "ACTIVO") AccentTeal.copy(alpha = 0.15f) else StatusDanger.copy(alpha = 0.15f),
                        shape = RoundedCornerShape(20.dp)
                    ) {
                        Text(
                            text = al.estado,
                            color = if (al.estado == "ACTIVO") AccentTeal else StatusDanger,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun ExpedienteAlumnoContent(
    alumno: AlumnoDto,
    documentos: List<DocumentoDto>,
    isUploading: Boolean,
    onUploadFile: (String, Uri, android.content.Context) -> Unit
) {
    val context = LocalContext.current
    var selectedTipoKey by remember { mutableStateOf<String?>(null) }

    val filePickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        val tipo = selectedTipoKey
        if (uri != null && tipo != null) {
            onUploadFile(tipo, uri, context)
        }
    }

    val tiposMap = mapOf(
        "ACTA_NACIMIENTO" to "Acta de Nacimiento",
        "CURP" to "CURP",
        "CERTIFICADO" to "Certificado de Bachillerato",
        "CONSTANCIA" to "Constancia de Estudios"
    )

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(20.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        modifier = Modifier.size(56.dp),
                        shape = CircleShape,
                        color = NavyPrimary
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text(
                                text = alumno.nombre.take(1).uppercase(),
                                color = Color.White,
                                fontSize = 22.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    Spacer(modifier = Modifier.width(16.dp))

                    Column {
                        Text(
                            text = alumno.nombre,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.onSurface
                        )
                        Text(
                            text = "Matrícula: ${alumno.matricula}",
                            fontSize = 13.sp,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                        )
                        Text(
                            text = alumno.carrera,
                            fontSize = 12.sp,
                            color = AccentTeal,
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                }
            }
        }

        item {
            Text(
                text = "Documentación Técnica del Expediente",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = NavyPrimary,
                modifier = Modifier.padding(vertical = 4.dp)
            )
        }

        items(tiposMap.toList()) { (keyTipo, labelTipo) ->
            val doc = documentos.find { it.tipo == keyTipo }
            DocumentoCard(
                tipoKey = keyTipo,
                tipoLabel = labelTipo,
                documento = doc,
                isUploading = isUploading,
                onSelectFile = { tipoKey ->
                    selectedTipoKey = tipoKey
                    filePickerLauncher.launch("*/*")
                }
            )
        }
    }
}

@Composable
private fun DocumentoCard(
    tipoKey: String,
    tipoLabel: String,
    documento: DocumentoDto?,
    isUploading: Boolean,
    onSelectFile: (String) -> Unit
) {
    val estado = documento?.estado ?: "PENDIENTE"

    val (badgeColor, badgeText, badgeIcon) = when (estado) {
        "APROBADO" -> Triple(AccentTeal, "APROBADO", Icons.Default.CheckCircle)
        "EN_REVISION" -> Triple(AccentGold, "EN REVISIÓN", Icons.Default.HourglassTop)
        "RECHAZADO" -> Triple(StatusDanger, "OBSERVADO", Icons.Default.Error)
        else -> Triple(Color.Gray, "PENDIENTE", Icons.Default.Pending)
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = tipoLabel,
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.onSurface
                )

                Surface(
                    color = badgeColor.copy(alpha = 0.15f),
                    shape = RoundedCornerShape(20.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = badgeIcon,
                            contentDescription = badgeText,
                            tint = badgeColor,
                            modifier = Modifier.size(14.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = badgeText,
                            color = badgeColor,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }

            if (estado == "RECHAZADO" && !documento?.razonRechazo.isNullOrEmpty()) {
                Spacer(modifier = Modifier.height(8.dp))
                Surface(
                    color = StatusDanger.copy(alpha = 0.08f),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text(
                        text = "Observación: ${documento?.razonRechazo}",
                        color = StatusDanger,
                        fontSize = 12.sp,
                        modifier = Modifier.padding(8.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            OutlinedButton(
                onClick = { onSelectFile(tipoKey) },
                enabled = !isUploading,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(8.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.FileUpload,
                    contentDescription = "Subir",
                    modifier = Modifier.size(16.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = if (documento == null) "Subir Documento" else "Reemplazar Documento",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }
    }
}

private fun getTipoLabel(tipo: String): String {
    return when (tipo) {
        "ACTA_NACIMIENTO" -> "Acta de Nacimiento"
        "CURP" -> "CURP"
        "CERTIFICADO" -> "Certificado de Bachillerato"
        "CONSTANCIA" -> "Constancia de Estudios"
        else -> tipo
    }
}
