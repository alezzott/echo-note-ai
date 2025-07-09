import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { logger } from "../utils/logger.utils";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  // Log sempre o erro
  logger.error("Erro capturado pelo middleware global", {
    error: err instanceof Error ? err.message : err,
    stack: err instanceof Error ? err.stack : undefined,
  });

  if (err instanceof multer.MulterError) {
    // Erros do Multer (upload)
    return res.status(400).json({
      error: "Erro no upload do arquivo.",
      code: err.code,
      message: err.message,
    });
  }

  if (
    process.env.NODE_ENV === "production" ||
    process.env.NODE_ENV === "staging"
  ) {
    // Erros genéricos
    return res.status(500).json({
      error: "Erro interno do servidor.",
    });
  }

  // Em desenvolvimento, envie detalhes para facilitar debug
  res.status(500).json({
    error: "Erro interno do servidor.",
    details: err instanceof Error ? err.message : err,
    stack: err instanceof Error ? err.stack : undefined,
  });
}
