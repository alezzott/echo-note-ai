import type { ITranscription } from "../models/transcription.model";
import type { TranscriptionRepository } from "../repositories/transcription.repository";

export class ListTranscriptionsUseCase {
  constructor(private repo: TranscriptionRepository) {}

  async execute(userId: string): Promise<ITranscription[]> {
    return this.repo.getByUserId(userId);
  }
}
