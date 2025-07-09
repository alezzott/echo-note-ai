import type { ITranscription } from "../models/transcription.model";

export function exportToTxt(transcription: ITranscription) {
  let content = `Transcrição: ${transcription.transcript}\n\n`;
  if (transcription.segments?.length) {
    content += transcription.segments
      .map((seg, _i) => `[${seg.start}s - ${seg.end}s] ${seg.text}`)
      .join("\n");
  }
  return {
    buffer: Buffer.from(content, "utf-8"),
    filename: `transcription-${transcription._id}.txt`,
    mimeType: "text/plain",
  };
}
