import fs from "node:fs";
import type { NextFunction, Request, Response } from "express";
import { TranscriptionRepository } from "../repositories/transcription.repository";
import { OpenAIService } from "../services/openai.service";
import { OpenAIMockService } from "../services/openai-mock.service";
import { TranscribeAudioUseCase } from "../usecases/transcribe-audio.usecase";
import { ExportTranscriptionUseCase } from "../usecases/transcrible-export-to-document.usecase";
import { GetTranscriptionByIdUseCase } from "../usecases/transcrible-get-id.usecase";
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
    const openai = useMock ? new OpenAIMockService() : new OpenAIService();

    const transcribe = new TranscribeAudioUseCase(repo, openai);

    const userId = req.user?.uid;
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
      logger.warn("Tentativa de listagem sem userId");
      return res.status(400).json({ error: "userId é obrigatório na query." });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const sortBy = (req.query.sortBy as string) || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1;

    logger.info("Listando transcrições", {
      userId,
      page,
      limit,
      sortBy,
      order,
    });

    const transcriptions = await repo.getByUserId(
      userId,
      skip,
      limit,
      sortBy,
      order,
    );

    logger.info("Transcrições encontradas", { count: transcriptions.length });
    res.json(transcriptions);
  } catch (error) {
    logger.error("Erro ao listar transcrições", { error });
    next(error);
  }
};

export const getTranscriptionById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    if (!id || typeof id !== "string") {
      logger.warn("Tentativa de busca sem id");
      return res.status(400).json({ error: "id é obrigatório nos params." });
    }

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      logger.warn("Tentativa de busca com id inválido", { id });
      return res.status(400).json({ error: "id inválido." });
    }

    logger.info("Buscando transcrição por id", { id });
    const usecase = new GetTranscriptionByIdUseCase(repo);
    const transcription = await usecase.execute(id);

    if (!transcription) {
      logger.info("Transcrição não encontrada", { id });
      return res.status(404).json({ error: "Transcrição não encontrada." });
    }

    logger.info("Transcrição encontrada", { id });
    res.json(transcription);
  } catch (error) {
    logger.error("Erro ao buscar transcrição por id", { error });
    next(error);
  }
};

export const exportTranscription = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<Response | undefined> => {
  try {
    const format = (req.query.format as string)?.toLowerCase() || "txt";
    const userId = req.user?.uid;

    if (!userId) {
      logger.warn("Usuário não autenticado para exportação");
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    logger.info("Solicitação de exportação de todas as transcrições", {
      userId,
      format,
    });

    const exportUseCase = new ExportTranscriptionUseCase(repo);
    const result = await exportUseCase.execute(userId, format);

    logger.info("Exportação múltipla concluída", { userId });

    res.setHeader("Content-Disposition", `attachment; filename="${result.filename}"`);
    res.setHeader("Content-Type", result.mimeType);
    return res.send(result.buffer);
  } catch (error) {
    const err = error as Error;
    logger.error("Erro ao exportar transcrições", { err });
    return res.status(400).json({ error: err.message || "Erro ao exportar transcrições." });
  }
};
