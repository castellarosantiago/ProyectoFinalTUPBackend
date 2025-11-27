import rateLimit from "express-rate-limit";

// Rate Limit global para todas las rutas de la API 
// Limita cada IP a 200 requests por cada 15 minutos
export const rateLimitGlobal = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 200, // límite por IP
  message: {
    error: "Demasiadas solicitudes realizadas. Inténtalo nuevamente más tarde."
  },
  standardHeaders: true,
  legacyHeaders: false,
});
