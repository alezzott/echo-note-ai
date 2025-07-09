import rateLimit from "express-rate-limit";
import { logger } from "../utils/logger.utils";

export const openAiRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    error: "Rate limit exceeded",
    message:
      "Você fez muitas transcrições em pouco tempo. Tente novamente em alguns minutos.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, _next, options) => {
    logger.warn(`Rate limit excedido por IP ${req.ip}`);
    res.status(options.statusCode).json({ error: options.message });
  },
});
