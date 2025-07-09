import type { TranscriptionRepository } from "../repositories/transcription.repository";
import { exportToTxt } from "../utils/export.utils";

export class ExportTranscriptionUseCase {
  constructor(private repo: TranscriptionRepository) {}

  async execute(id: string, format: string) {
    const transcription = await this.repo.getById(id);
    if (!transcription) throw new Error("Transcrição não encontrada.");

    switch (format) {
      case "txt":
        return exportToTxt(transcription);
      default:
        throw new Error("Formato não suportado.");
    }
  }
}
