import type { NextFunction, Request, Response } from "express";

export function firebaseAuthMock(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  // Simula usuário autenticado
  req.user = { uid: "test-user" };
  next();
}
