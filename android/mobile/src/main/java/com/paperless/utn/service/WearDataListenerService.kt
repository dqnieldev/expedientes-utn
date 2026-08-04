package com.paperless.utn.service

import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Vibrator
import android.os.VibratorManager
import com.google.android.gms.wearable.MessageEvent
import com.google.android.gms.wearable.WearableListenerService

class WearDataListenerService : WearableListenerService() {

    override fun onMessageReceived(messageEvent: MessageEvent) {
        super.onMessageReceived(messageEvent)
        if (messageEvent.path == "/shake_gesture_sync") {
            // 1. Respuesta Háptica: Hacer vibrar el teléfono celular al recibir el gesto del reloj
            vibratePhone(applicationContext)

            // 2. Broadcast Local: Disparar la recarga en tiempo real de datos desde la API REST
            val intent = Intent("com.paperless.utn.ACTION_REFRESH_EXPEDIENTE").apply {
                setPackage(packageName)
            }
            sendBroadcast(intent)
        }
    }

    private fun vibratePhone(context: Context) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val vibratorManager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as VibratorManager
                vibratorManager.defaultVibrator.vibrate(
                    android.os.VibrationEffect.createOneShot(350, android.os.VibrationEffect.DEFAULT_AMPLITUDE)
                )
            } else {
                @Suppress("DEPRECATION")
                val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
                vibrator.vibrate(350)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
