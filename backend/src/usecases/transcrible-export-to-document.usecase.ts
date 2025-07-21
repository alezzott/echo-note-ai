import type { ITranscription } from "../models/transcription.model";
import type { TranscriptionRepository } from "../repositories/transcription.repository";
import { exportManyToTxt } from "../utils/export.utils";
import { logger } from "../utils/logger.utils";

export class ExportTranscriptionUseCase {
  constructor(private repo: TranscriptionRepository) {}

  async execute(userId: string, format: string) {
    const transcriptions: ITranscription[] = await this.repo.getAllByUserId(userId);
    logger.info("Transcrições encontradas:", { transcriptions: transcriptions.length });
    if (!transcriptions.length) throw new Error("Nenhuma transcrição encontrada.");

    switch (format) {
      case "txt":
        return exportManyToTxt(transcriptions, userId);
      default:
        throw new Error("Formato não suportado.");
    }
  }
}