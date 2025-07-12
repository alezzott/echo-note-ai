import fs from "node:fs";
import { OpenAI } from "openai";

import type { ITranscriptionService } from "../models/transcription.model";

export class OpenAIService implements ITranscriptionService {
	private openai: OpenAI;

	constructor() {
		const apiKey = process.env.OPENAI_API_KEY;
		if (!apiKey) {
			throw new Error("OPENAI_API_KEY environment variable is not set.");
		}

		this.openai = new OpenAI({
			apiKey,
			baseURL: "https://api.lemonfox.ai/v1",
		});
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
