import type { ITranscription } from "../models/transcription.model";
import type { TranscriptionRepository } from "../repositories/transcription.repository";

export class GetTranscriptionByIdUseCase {
  constructor(private repo: TranscriptionRepository) {}

  async execute(id: string): Promise<ITranscription | null> {
    return this.repo.getById(id);
  }
}
