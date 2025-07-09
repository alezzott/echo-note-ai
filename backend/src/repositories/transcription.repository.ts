import Transcription, {
  type ITranscription,
} from "../models/transcription.model";

export class TranscriptionRepository {
  async create(data: Partial<ITranscription>): Promise<ITranscription> {
    return Transcription.create(data);
  }

  async getByUserId(
    userId: string,
    skip = 0,
    limit = 10,
    sortBy = "createdAt",
    order: 1 | -1 = -1,
  ): Promise<ITranscription[]> {
    return Transcription.find({ userId })
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit);
  }
}
