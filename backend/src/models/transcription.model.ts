import { type Document, model, Schema } from "mongoose";

export interface ITranscriptionService {
  transcribeAudio(filePath: string): Promise<{
    text: string;
    segments: Segment[];
    language: string;
  }>;
}

export interface Segment {
  start: number;
  end: number;
  text: string;
}

export interface ITranscription extends Document {
  userId: string;
  filename: string;
  transcript: string;
  segments: Segment[];
  language: string;
  createdAt: Date;
}

const segmentSchema = new Schema<Segment>({
  start: Number,
  end: Number,
  text: String,
});

const transcriptionSchema = new Schema<ITranscription>({
  userId: { type: String, required: true },
  filename: { type: String, required: true },
  transcript: { type: String, required: true },
  segments: [segmentSchema],
  language: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default model<ITranscription>("Transcription", transcriptionSchema);
