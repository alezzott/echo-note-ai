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

/**
 * Exporta todas as transcrições recebidas para um arquivo .txt
 */
export function exportAllToTxt(transcriptions: Transcription[]) {
  if (!transcriptions.length) return;

  let content = "";
  transcriptions.forEach((t, idx) => {
    content += `#${idx + 1} - Arquivo: ${t.filename}\n`;
    content += `Idioma: ${t.language}\n`;
    content += `Criado em: ${new Date(t.createdAt).toLocaleString()}\n\n`;
    content += `Transcrição:\n${t.transcript}\n\n`;
    if (t.segments && t.segments.length > 0) {
      content += "Segmentos:\n";
      t.segments.forEach((seg, sidx) => {
        content += `[${sidx + 1}] ${seg.start}s - ${seg.end}s: ${seg.text}\n`;
      });
    }
    content += "\n-----------------------------\n\n";
  });

  const blob = new Blob([content], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "transcricoes.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}