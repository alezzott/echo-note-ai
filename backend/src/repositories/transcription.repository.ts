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
    search?: string,
  ): Promise<ITranscription[]> {
    const query: Record<string, unknown> = { userId };
    if (search && search.trim() !== "") {
      query.transcript = { $regex: search, $options: "i" };
    }

    return Transcription.find(query)
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit)
      .select("-__v");
  }

  async getById(id: string): Promise<ITranscription | null> {
    return Transcription.findById(id).select("-__v");
  }

  async getAllByUserId(userId: string) {
    return Transcription.find({ userId });
  }
}
