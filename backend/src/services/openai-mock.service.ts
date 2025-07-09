import type { ITranscriptionService } from "../models/transcription.model";

export class OpenAIMockService implements ITranscriptionService {
  async transcribeAudio(_filePathh: string) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      text: "Transcrição mockada do áudio.",
      segments: [{ start: 0, end: 2, text: "Transcrição mockada do áudio." }],
      language: "pt",
    };
  }
}
