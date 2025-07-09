import type { NextFunction, Request, Response } from "express";
import multer from "multer";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      error: err.message || "Erro no upload do arquivo.",
      code: err.code,
    });
  }

  res.status(500).json({
    error: "Erro interno do servidor.",
    details: err,
  });
}
