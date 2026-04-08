import rateLimit from "express-rate-limit";

export const loginRateLimit = rateLimit({
  windowMs:         15 * 60 * 1000, // 15 minutos
  max:              5,               // máximo 5 intentos
  skipSuccessfulRequests: true,      // no cuenta los logins exitosos
  standardHeaders:  true,
  legacyHeaders:    false,
  handler: (req, res) => {
    const minutos = Math.ceil(req.rateLimit.resetTime / 1000 / 60);
    res.status(429).json({
      message: `Demasiados intentos fallidos. Intenta de nuevo en 15 minutos.`,
      retryAfter: req.rateLimit.resetTime,
    });
  },
});