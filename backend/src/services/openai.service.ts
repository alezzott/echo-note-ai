import fs from "node:fs";
import { OpenAI } from "openai";

import type { ITranscriptionService } from "../models/transcription.model";

export class OpenAIService implements ITranscriptionService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async transcribeAudio(filePath: string) {
    const result = await this.openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "whisper-1",
      response_format: "verbose_json",
      language: "pt",
    });

    return {
      text: result.text,
      segments: result.segments ?? [],
      language: result.language ?? "pt",
    };
  }
}
