import type { NextFunction, Request, Response } from "express";
import multer from "multer";
import { logger } from "../utils/logger.utils";

function isMulterError(err: unknown): err is multer.MulterError {
  return err instanceof multer.MulterError;
}

function isUnsupportedFileTypeError(err: unknown): err is Error {
  return (
    err instanceof Error &&
    err.message.includes("Tipo de arquivo não suportado")
  );
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  logger.error("Erro capturado pelo middleware global", {
    error: err instanceof Error ? err.message : err,
    stack: err instanceof Error ? err.stack : undefined,
  });

  if (isMulterError(err)) {
    return res.status(400).json({
      error: "Erro no upload do arquivo.",
      code: err.code,
      message: err.message,
    });
  }

  if (isUnsupportedFileTypeError(err)) {
    return res.status(400).json({
      error: err.message,
    });
  }

  if (
    process.env.NODE_ENV === "production" ||
    process.env.NODE_ENV === "staging"
  ) {
    return res.status(500).json({
      error: "Erro interno do servidor.",
    });
  }

  return res.status(500).json({
    error: "Erro interno do servidor.",
    details: err instanceof Error ? err.message : err,
    stack: err instanceof Error ? err.stack : undefined,
  });
}
