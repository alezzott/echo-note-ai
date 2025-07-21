import type { Transcription } from '@/stores/transcriptions';

function escapeCsv(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export function exportAllToCsv(transcriptions: Transcription[]) {
  if (!transcriptions.length) return;

  const headers = [
    'Arquivo',
    'Idioma',
    'Criado em',
    'Transcrição',
    'Segmentos',
  ];

  const rows = transcriptions.map((t) => [
    t.filename,
    t.language,
    new Date(t.createdAt).toLocaleString(),
    t.transcript,
    t.segments
      ?.map((seg) => `[${seg.start}s-${seg.end}s] ${seg.text}`)
      .join(' | ') ?? '',
  ]);

  const csvContent =
    headers.map(escapeCsv).join(',') +
    '\n' +
    rows
      .map((row) => row.map((val) => escapeCsv(String(val ?? ''))).join(','))
      .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'transcricoes.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
