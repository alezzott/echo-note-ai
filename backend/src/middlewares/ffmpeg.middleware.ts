import type { NextFunction, Request, Response } from "express";
import ffprobe from "ffprobe-client";
import { logger } from "../utils/logger.utils";

async function getAudioDuration(filePath: string): Promise<number | undefined> {
  const info = await ffprobe(filePath);
  if (!info || !info.streams) return undefined;
  const duration = info.streams?.[0]?.duration
    ? parseFloat(info.streams[0].duration)
    : undefined;
  return duration;
}

export function checkAudioDuration(
  maxSeconds: number,
  _fileField: string = "file",
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
    if (!file) {
      logger.warn("Arquivo de áudio não encontrado no request.");
      return res.status(400).json({ error: "Arquivo de áudio obrigatório" });
    }

    try {
      const duration = await getAudioDuration(file.path);

      if (duration === undefined) {
        logger.warn("Não foi possível analisar a duração do áudio", {
          file: file.originalname,
        });
        return res
          .status(400)
          .json({ error: "Não foi possível analisar a duração do áudio" });
      }

      if (duration > maxSeconds) {
        logger.warn(
          `Áudio rejeitado: ${file.originalname} (${duration}s > ${maxSeconds}s)`,
        );
        return res.status(400).json({
          error: `O áudio deve ter no máximo ${maxSeconds} segundos.`,
          duration,
        });
      }

      logger.info(`Áudio aceito: ${file.originalname} (${duration}s)`);
      next();
    } catch (err: unknown) {
      logger.error("Erro ao analisar áudio com ffprobe", {
        error: err instanceof Error ? err.message : err,
        stack: err instanceof Error ? err.stack : undefined,
      });
      return res.status(400).json({ error: "Erro ao analisar o áudio" });
    }
  };
}
