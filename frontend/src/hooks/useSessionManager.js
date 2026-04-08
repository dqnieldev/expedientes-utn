import { useEffect, useRef, useState, useCallback } from "react";
import {
  logout,
  updateActivity,
  getInactivityTime,
  isTokenExpired,
  INACTIVITY_LIMIT,
} from "../services/authService";

const WARNING_BEFORE = 2 * 60 * 1000; // mostrar aviso 2 min antes de expirar por inactividad

export function useSessionManager() {
  const [showWarning, setShowWarning]     = useState(false);
  const [countdown,   setCountdown]       = useState(120); // segundos
  const intervalRef   = useRef(null);
  const countdownRef  = useRef(null);

  // Extiende la sesión — resetea inactividad
  const extendSession = useCallback(() => {
    updateActivity();
    setShowWarning(false);
    setCountdown(120);
    clearInterval(countdownRef.current);
  }, []);

  // Inicia cuenta regresiva de 2 minutos
  const startCountdown = useCallback(() => {
    setShowWarning(true);
    setCountdown(120);
    clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          logout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Registrar actividad del usuario
  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    const handleActivity = () => {
      if (!showWarning) updateActivity(); // solo actualiza si no está en aviso
    };
    events.forEach(e => window.addEventListener(e, handleActivity));
    updateActivity(); // inicializa al montar

    return () => events.forEach(e => window.removeEventListener(e, handleActivity));
  }, [showWarning]);

  // Verificación periódica cada 30 segundos
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      // 1. Token JWT expirado → logout inmediato
      if (isTokenExpired()) {
        logout();
        return;
      }

      const inactivity = getInactivityTime();

      // 2. Superó 30 min de inactividad → logout inmediato
      if (inactivity >= INACTIVITY_LIMIT) {
        logout();
        return;
      }

      // 3. Faltan 2 min para llegar al límite de inactividad → aviso
      if (inactivity >= INACTIVITY_LIMIT - WARNING_BEFORE && !showWarning) {
        startCountdown();
      }
    }, 30 * 1000); // cada 30 segundos

    return () => clearInterval(intervalRef.current);
  }, [showWarning, startCountdown]);

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(countdownRef.current);
    };
  }, []);

  return { showWarning, countdown, extendSession };
}