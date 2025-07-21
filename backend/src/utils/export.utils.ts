import type { ITranscription } from "../models/transcription.model";

export function exportManyToTxt(transcriptions: ITranscription[], userId: string) {
  let content = "";
  transcriptions.forEach((t, idx) => {
    content += `Transcrição #${idx + 1} (${t.filename || t._id}):\n${t.transcript}\n\n`;
    if (t.segments?.length) {
      content += t.segments
        .map((seg) => `[${seg.start}s - ${seg.end}s] ${seg.text}`)
        .join("\n");
      content += "\n\n";
    }
  });
  return {
    buffer: Buffer.from(content, "utf-8"),
    filename: `transcriptions-${userId}.txt`,
    mimeType: "text/plain",
  };
}