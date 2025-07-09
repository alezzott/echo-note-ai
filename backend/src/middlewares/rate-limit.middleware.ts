import rateLimit from "express-rate-limit";

export const openAiRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message:
    "Muitas requisições para foram feitas. Tente novamente em instantes.",
  standardHeaders: true,
  legacyHeaders: false,
});
