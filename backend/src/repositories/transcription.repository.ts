import Transcription, {
  type ITranscription,
} from "../models/transcription.model";

export class TranscriptionRepository {
  async create(data: Partial<ITranscription>): Promise<ITranscription> {
    return Transcription.create(data);
  }
}
