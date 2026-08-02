package com.paperless.utn.wear.notification

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import com.paperless.utn.wear.R
import com.paperless.utn.wear.WearMainActivity

object WearNotificationHelper {

    private const val CHANNEL_ID = "wear_expediente_channel"
    private const val CHANNEL_NAME = "Notificaciones de Expediente Wear"
    private const val NOTIFICATION_ID = 8801

    fun enviarNotificacionExpediente(
        context: Context,
        titulo: String,
        mensaje: String
    ) {
        val notificationManager =
            context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                CHANNEL_NAME,
                NotificationManager.IMPORTANCE_HIGH
            ).apply {
                description = "Canal prioritario de dictamen de expedientes para Wear OS"
                enableVibration(true)
                vibrationPattern = longArrayOf(0, 150, 100, 200)
            }
            notificationManager.createNotificationChannel(channel)
        }

        val intent = Intent(context, WearMainActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }

        val pendingIntent = PendingIntent.getActivity(
            context,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(context, CHANNEL_ID)
            .setSmallIcon(R.drawable.app_logo)
            .setContentTitle(titulo)
            .setContentText(mensaje)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setVibrate(longArrayOf(0, 150, 100, 200))
            .setContentIntent(pendingIntent)
            .setAutoCancel(true)
            .setStyle(NotificationCompat.BigTextStyle().bigText(mensaje))
            .build()

        notificationManager.notify(NOTIFICATION_ID, notification)
    }
}
