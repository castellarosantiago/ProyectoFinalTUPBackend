import rateLimit from "express-rate-limit";

// rate limiter fuerte solo para login. protege de ataques de fuerza bruta
export const rateLimitLogin = rateLimit({
  windowMs: process.env.NODE_ENV === 'test' ? 1 : 10 * 60 * 1000, // 1ms en tests (reset instant), 10min en prod
  max: process.env.NODE_ENV === 'test' ? 1000 : 5, // sin límite en tests, 5 en prod
  message: {
    error: "demasiados intentos de inicio de sesión. intente nuevamente más tarde."
  },
  standardHeaders: true,
  legacyHeaders: false,
});
