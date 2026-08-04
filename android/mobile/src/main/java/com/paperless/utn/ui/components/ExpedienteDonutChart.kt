package com.paperless.utn.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.paperless.utn.data.model.DocumentoDto

// Definición de Colores Enterprise para Estados de Expediente
val ColorAprobado = Color(0xFF10B981)   // Verde Emerald
val ColorEnRevision = Color(0xFFF59E0B) // Amarillo Amber
val ColorRechazado = Color(0xFFEF4444)  // Rojo Observado
val ColorPendiente = Color(0xFFE2E8F0)  // Slate Claro

data class ExpedienteStats(
    val aprobados: Int = 0,
    val enRevision: Int = 0,
    val rechazados: Int = 0,
    val pendientes: Int = 0,
    val total: Int = 4
) {
    val porcentajeProgreso: Int
        get() = if (total > 0) ((aprobados.toFloat() / total) * 100).toInt() else 0
}

fun calcularEstadisticasExpediente(documentos: List<DocumentoDto>?): ExpedienteStats {
    if (documentos.isNullOrEmpty()) {
        return ExpedienteStats(total = 4, pendientes = 4)
    }
    
    var aprobados = 0
    var enRevision = 0
    var rechazados = 0
    var pendientes = 0

    documentos.forEach { doc ->
        when (doc.estado.uppercase()) {
            "APROBADO" -> aprobados++
            "EN_REVISION" -> enRevision++
            "RECHAZADO" -> rechazados++
            else -> pendientes++
        }
    }

    val totalDocs = maxOf(documentos.size, 4)
    val noClasificados = maxOf(0, totalDocs - (aprobados + enRevision + rechazados + pendientes))
    pendientes += noClasificados

    return ExpedienteStats(
        aprobados = aprobados,
        enRevision = enRevision,
        rechazados = rechazados,
        pendientes = pendientes,
        total = totalDocs
    )
}

@Composable
fun ExpedienteDonutCard(
    stats: ExpedienteStats,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // ENCABEZADO Y BARRA DE PROGRESO
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Expediente Digital",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF0F172A)
                )

                Column(horizontalAlignment = Alignment.End) {
                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        Text(
                            text = "PROGRESO",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF64748B)
                        )
                        Text(
                            text = "${stats.porcentajeProgreso}%",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF0F172A)
                        )
                    }

                    Spacer(modifier = Modifier.height(4.dp))

                    LinearProgressIndicator(
                        progress = { stats.porcentajeProgreso / 100f },
                        modifier = Modifier
                            .width(100.dp)
                            .height(6.dp),
                        color = ColorAprobado,
                        trackColor = Color(0xFFF1F5F9),
                        strokeCap = StrokeCap.Round
                    )
                }
            }

            // DONA Y TARJETAS DE CONTADORES DE ESTADO
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                // DONA DIBUJADA CON CANVAS
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier.size(110.dp)
                ) {
                    Canvas(modifier = Modifier.size(100.dp)) {
                        val strokeWidth = 14.dp.toPx()
                        val total = if (stats.total > 0) stats.total.toFloat() else 4f
                        
                        val sweepAprobados = (stats.aprobados / total) * 360f
                        val sweepEnRevision = (stats.enRevision / total) * 360f
                        val sweepRechazados = (stats.rechazados / total) * 360f
                        val sweepPendientes = 360f - (sweepAprobados + sweepEnRevision + sweepRechazados)

                        var startAngle = -90f

                        // 1. Arco Aprobados (Verde)
                        if (sweepAprobados > 0) {
                            drawArc(
                                color = ColorAprobado,
                                startAngle = startAngle,
                                sweepAngle = sweepAprobados,
                                useCenter = false,
                                style = Stroke(width = strokeWidth, cap = StrokeCap.Butt)
                            )
                            startAngle += sweepAprobados
                        }

                        // 2. Arco En Revisión (Amarillo)
                        if (sweepEnRevision > 0) {
                            drawArc(
                                color = ColorEnRevision,
                                startAngle = startAngle,
                                sweepAngle = sweepEnRevision,
                                useCenter = false,
                                style = Stroke(width = strokeWidth, cap = StrokeCap.Butt)
                            )
                            startAngle += sweepEnRevision
                        }

                        // 3. Arco Rechazados (Rojo)
                        if (sweepRechazados > 0) {
                            drawArc(
                                color = ColorRechazado,
                                startAngle = startAngle,
                                sweepAngle = sweepRechazados,
                                useCenter = false,
                                style = Stroke(width = strokeWidth, cap = StrokeCap.Butt)
                            )
                            startAngle += sweepRechazados
                        }

                        // 4. Arco Pendientes (Gris)
                        if (sweepPendientes > 0) {
                            drawArc(
                                color = ColorPendiente,
                                startAngle = startAngle,
                                sweepAngle = sweepPendientes,
                                useCenter = false,
                                style = Stroke(width = strokeWidth, cap = StrokeCap.Butt)
                            )
                        }
                    }

                    // TEXTO CENTRAL DENTRO DE LA DONA
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "${stats.aprobados + stats.enRevision + stats.rechazados}/${stats.total}",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Black,
                            color = Color(0xFF0F172A)
                        )
                        Text(
                            text = "documentos",
                            fontSize = 10.sp,
                            color = Color(0xFF64748B)
                        )
                    }
                }

                Spacer(modifier = Modifier.width(12.dp))

                // REJILLA DE 4 CONTADORES
                Column(
                    modifier = Modifier.weight(1f),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        StatusTile(
                            title = "Aprobados",
                            count = stats.aprobados,
                            textColor = Color(0xFF047857),
                            bgColor = Color(0xFFECFDF5),
                            modifier = Modifier.weight(1f)
                        )
                        StatusTile(
                            title = "En Revisión",
                            count = stats.enRevision,
                            textColor = Color(0xFFB45309),
                            bgColor = Color(0xFFFFFBEB),
                            modifier = Modifier.weight(1f)
                        )
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        StatusTile(
                            title = "Rechazados",
                            count = stats.rechazados,
                            textColor = Color(0xFFB91C1C),
                            bgColor = Color(0xFFFEF2F2),
                            modifier = Modifier.weight(1f)
                        )
                        StatusTile(
                            title = "Pendientes",
                            count = stats.pendientes,
                            textColor = Color(0xFF64748B),
                            bgColor = Color(0xFFF8FAFC),
                            modifier = Modifier.weight(1f)
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun StatusTile(
    title: String,
    count: Int,
    textColor: Color,
    bgColor: Color,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .background(bgColor, shape = RoundedCornerShape(12.dp))
            .padding(10.dp)
    ) {
        Column {
            Text(
                text = title,
                fontSize = 11.sp,
                color = textColor.copy(alpha = 0.9f),
                fontWeight = FontWeight.Medium
            )
            Spacer(modifier = Modifier.height(2.dp))
            Text(
                text = count.toString(),
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = textColor
            )
        }
    }
}
