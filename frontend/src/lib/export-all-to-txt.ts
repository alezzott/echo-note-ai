type Segment = {
  start: number;
  end: number;
  text: string;
  _id: string;
};

type Transcription = {
  _id: string;
  userId: string;
  filename: string;
  transcript: string;
  segments: Segment[];
  language: string;
  createdAt: string;
};

function buildTranscriptionsTxt(transcriptions: Transcription[]): string {
  return transcriptions.map((t, idx) => {
    let txt = `#${idx + 1} - Arquivo: ${t.filename}\n`;
    txt += `Idioma: ${t.language}\n`;
    txt += `Criado em: ${new Date(t.createdAt).toLocaleString()}\n\n`;
    txt += `Transcrição:\n${t.transcript}\n\n`;
    if (t.segments?.length) {
      txt += "Segmentos:\n";
      txt += t.segments.map((seg, sidx) =>
        `[${sidx + 1}] ${seg.start}s - ${seg.end}s: ${seg.text}\n`
      ).join("");
    }
    txt += "\n-----------------------------\n\n";
    return txt;
  }).join("");
}

export function exportAllToTxt(transcriptions: Transcription[]) {
  if (!transcriptions.length) return;
  const content = buildTranscriptionsTxt(transcriptions);
  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "transcricoes.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}