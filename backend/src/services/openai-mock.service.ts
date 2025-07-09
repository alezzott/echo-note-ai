import type { ITranscriptionService } from "../models/transcription.model";

export class OpenAIMockService implements ITranscriptionService {
  async transcribeAudio(
    _filePath: string,
    options?: { text?: string; language?: string },
  ) {
    await new Promise((resolve) => setTimeout(resolve, 300));

    const text = options?.text ?? "Transcrição mockada do áudio.";
    const language = options?.language ?? "pt";

    const sentences = text.split(".").filter(Boolean);
    const segments = sentences.map((sentence, idx) => ({
      start: idx * 2,
      end: (idx + 1) * 2,
      text: `${sentence.trim()}.`,
    }));

    return {
      text,
      segments,
      language,
    };
  }
}
