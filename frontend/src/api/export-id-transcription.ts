import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

/**
 * Faz download da transcrição individual em .txt pelo id
 */
export async function exportTranscriptionById(
  id: string,
  format: 'csv' | 'txt',
  filename?: string,
  token?: string,
) {
  const response = await api.get(`/export/${id}`, {
    params: { format },
    responseType: 'blob',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  const blob = new Blob([response.data], {
    type: format === 'csv' ? 'text/csv' : 'text/plain',
  });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename ? `${filename}.${format}` : `transcricao.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
