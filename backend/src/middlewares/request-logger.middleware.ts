import type { NextFunction, Request, Response } from "express";
import { logger } from "../utils/logger.utils";

export function requestLogger(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  logger.info("Nova requisição", {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
    userId: req.headers["x-user-id"] || req.body?.userId,
  });
  next();
}
