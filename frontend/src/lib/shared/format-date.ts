export function formatDate(dateStr?: string): string {
  if (!dateStr) return 'Data desconhecida';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}
