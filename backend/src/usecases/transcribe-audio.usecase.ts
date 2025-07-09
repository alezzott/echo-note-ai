import type { ITranscriptionService } from "../models/transcription.model";

import type { TranscriptionRepository } from "../repositories/transcription.repository";
export class TranscribeAudioUseCase {
  constructor(
    private repo: TranscriptionRepository,
    private transcriptionService: ITranscriptionService,
  ) {}

  async execute(userId: string, filename: string, filePath: string) {
    const response = await this.transcriptionService.transcribeAudio(filePath);
    const { text, segments, language } = response as any;

    const transcription = await this.repo.create({
      userId,
      filename,
      transcript: text,
      segments,
      language,
    });

    return transcription;
  }
}
