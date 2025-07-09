import fs from "node:fs";
import type { NextFunction, Request, Response } from "express";
import { TranscriptionRepository } from "../repositories/transcription.repository";
import { OpenAIService } from "../services/openai.service";
import { OpenAIMockService } from "../services/openai-mock.service";
import { TranscribeAudioUseCase } from "../usecases/transcribe-audio.usecase";
import { logger } from "../utils/logger.utils";

const repo = new TranscriptionRepository();

export const transcribeAudio = async (req: Request, res: Response) => {
  let tempFilePath: string | undefined;
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return res
        .status(500)
        .json({ error: "OPENAI_API_KEY não configurada no ambiente" });
    }

    const useMock = process.env.USE_MOCK_TRANSCRIBE === "true";
    const openai = useMock
      ? new OpenAIMockService()
      : new OpenAIService(apiKey);

    const transcribe = new TranscribeAudioUseCase(repo, openai);

    const userId = req.body.userId || req.headers["x-user-id"];
    if (!userId || !req.file)
      return res.status(400).json({ error: "userId e arquivo obrigatórios" });

    logger.info("Recebido:", {
      userId,
      file: req.file?.originalname,
      mimetype: req.file?.mimetype,
      size: req.file?.size,
    });

    const transcription = await transcribe.execute(
      userId as string,
      req.file.originalname,
      req.file.path,
    );

    logger.info("Transcrição salva:", {
      id: transcription._id,
      language: transcription.language,
      textPreview: transcription.transcript?.slice(0, 100),
      segmentsCount: transcription.segments?.length,
    });

    fs.unlinkSync(req.file.path);

    res.json({
      transcriptionId: transcription._id,
      text: transcription.transcript,
      segments: transcription.segments,
      language: transcription.language,
    });
  } catch (err: unknown) {
    tempFilePath = undefined;
    const errorObj = err as { status?: number; error?: { code?: string } };

    if (
      errorObj?.status === 429 ||
      errorObj?.error?.code === "rate_limit_exceeded"
    ) {
      logger.warn("Rate limit da OpenAI atingido", { error: errorObj });
      return res.status(429).json({
        error:
          "Limite de requisições da OpenAI atingido. Tente novamente em instantes.",
        details: errorObj?.error || errorObj,
      });
    }

    logger.error("Erro ao transcrever áudio", { error: err });
    console.error("Erro capturado no catch do controller:", err);
    res.status(500).json({ error: "Erro ao transcrever áudio", details: err });
  } finally {
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
      } catch (e) {
        logger.error("Erro ao remover arquivo temporário", { error: e });
      }
    }
  }
};

export const listTranscriptions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.query.userId as string;
    if (!userId || typeof userId !== "string" || userId.trim() === "") {
      return res.status(400).json({ error: "userId é obrigatório na query." });
    }

    // Paginação
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Ordenação
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    const transcriptions = await repo.getByUserId(
      userId,
      skip,
      limit,
      sortBy,
      order,
    );
    res.json(transcriptions);
  } catch (error) {
    next(error);
  }
};
