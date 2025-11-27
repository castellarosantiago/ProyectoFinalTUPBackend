import rateLimit from "express-rate-limit";

// Rate Limit fuerte solo para Login. Protege de ataques de fuerza bruta.
export const rateLimitLogin = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 5, // solo 5 intentos de login
  message: {
    error: "Demasiados intentos de inicio de sesión. Intente nuevamente más tarde."
  },
  standardHeaders: true,
  legacyHeaders: false,
});
