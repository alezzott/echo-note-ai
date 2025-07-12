import type { NextFunction, Request, Response } from "express";
import admin from "../config/firebase-admin-deploy.config";

export async function firebaseAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token não fornecido." });
  }
  const idToken = authHeader.split(" ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = { uid: decoded.uid };
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido." });
  }
}
