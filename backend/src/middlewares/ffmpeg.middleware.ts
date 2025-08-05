import { exec } from "node:child_process";
import path from "node:path";
import type { NextFunction, Request, Response } from "express";
import ffprobe from "ffprobe-client";
import { logger } from "../utils/logger.utils";

async function getAudioDuration(filePath: string): Promise<number | undefined> {
  try {
    const info = await ffprobe(filePath);
    logger.debug("ffprobe info", { filePath, info });
    if (!info || !info.streams) {
      logger.warn("ffprobe não retornou streams", { filePath, info });
      return undefined;
    }
    const duration = info.streams?.[0]?.duration
      ? parseFloat(info.streams[0].duration)
      : undefined;
    if (!duration) {
      logger.warn("ffprobe não conseguiu extrair duração", {
        filePath,
        streams: info.streams,
      });
    }
    return duration;
  } catch (err) {
    logger.error("Erro ao executar ffprobe", {
      filePath,
      error: err instanceof Error ? err.message : err,
      stack: err instanceof Error ? err.stack : undefined,
    });
    return undefined;
  }
}
async function convertToWav(inputPath: string): Promise<string> {
  const outputPath = inputPath.replace(/\.webm$/, ".wav");
  await new Promise((resolve, reject) => {
    exec(`ffmpeg -y -i "${inputPath}" "${outputPath}"`, (err) => {
      if (err) reject(err);
      else resolve(true);
    });
  });
  return outputPath;
}

export function checkAudioDuration(
  maxSeconds: number,
  _fileField: string = "audio",
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const file = req.file;
    if (!file) {
      logger.warn("Arquivo de áudio não encontrado no request.");
      return res.status(400).json({ error: "Arquivo de áudio obrigatório" });
    }

    logger.info("Arquivo recebido", {
      originalname: file.originalname,
      mimetype: file.mimetype,
      path: file.path,
      size: file.size,
    });

    try {
      let audioPath = file.path;
      if (
        file.mimetype === "audio/webm" ||
        path.extname(file.path) === ".webm"
      ) {
        audioPath = await convertToWav(file.path);
      }
      const duration = await getAudioDuration(audioPath);

      if (duration === undefined) {
        logger.warn("Não foi possível analisar a duração do áudio", {
          file: file.originalname,
          mimetype: file.mimetype,
          path: file.path,
          size: file.size,
        });
        return res.status(400).json({
          error: "Não foi possível analisar a duração do áudio",
        });
      }

      if (duration > maxSeconds) {
        logger.warn(
          `Áudio rejeitado: ${file.originalname} (${duration}s > ${maxSeconds}s)`,
          { duration, maxSeconds, file: file.originalname },
        );
        return res.status(400).json({
          error: `O áudio deve ter no máximo ${maxSeconds} segundos.`,
          duration,
        });
      }

      logger.info(`Áudio aceito: ${file.originalname} (${duration}s)`, {
        duration,
        file: file.originalname,
      });
      next();
    } catch (err: unknown) {
      logger.error("Erro ao analisar áudio com ffprobe", {
        file: file.originalname,
        mimetype: file.mimetype,
        path: file.path,
        size: file.size,
        error: err instanceof Error ? err.message : err,
        stack: err instanceof Error ? err.stack : undefined,
      });
      return res.status(400).json({ error: "Erro ao analisar o áudio" });
    }
  };
}
