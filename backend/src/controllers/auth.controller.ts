import type { Request, Response } from "express";
import admin from "../config/firebase-admin.config";
import { logger } from "../utils/logger.utils";

export async function googleAuthController(req: Request, res: Response) {
	const { idToken } = req.body;
	if (!idToken || typeof idToken !== "string" || idToken.trim() === "") {
		logger.warn("Tentativa de login sem idToken ou idToken inválido", {
			body: req.body,
		});
		return res
			.status(400)
			.json({ error: "idToken não fornecido ou inválido." });
	}

	try {
		const decoded = await admin.auth().verifyIdToken(idToken);
		logger.info("Login Google bem-sucedido", {
			uid: decoded.uid,
			email: decoded.email,
			name: decoded.name,
		});

		return res.json({
			uid: decoded.uid,
			email: decoded.email,
			name: decoded.name,
			picture: decoded.picture,
		});
	} catch (error) {
		logger.error("Erro ao validar idToken do Google", { error });
		return res.status(401).json({ error: "Token inválido." });
	}
}
