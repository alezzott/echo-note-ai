import { reactive, toRefs } from 'vue';
import axios, { type AxiosProgressEvent, type CancelTokenSource } from 'axios';
import { toast } from 'vue-sonner';
import { transcribeAudio } from '../api/create-transcription';
import { useLoading } from './useLoading';
import { useUserStore } from '../stores/user';

type TranscriptionState = {
  audioFile: File | null;
  transcript: string;
  error: string;
  progress: number;
  cancelToken: CancelTokenSource | null;
};

export function useCreateTranscription() {
  const userStore = useUserStore();
  const { loading, start, stop } = useLoading();

  const state = reactive<TranscriptionState>({
    audioFile: null,
    transcript: '',
    error: '',
    progress: 0,
    cancelToken: null,
  });

  async function handleUpload(): Promise<void> {
    if (!state.audioFile) return;

    start();
    resetErrorAndTranscript();
    state.progress = 0;
    state.cancelToken = axios.CancelToken.source();

    try {
      const response = await transcribeAudio({
        audioFile: state.audioFile,
        token: userStore.token ?? '',
        cancelToken: state.cancelToken,
        onUploadProgress: handleUploadProgress,
      });

      state.transcript = response.text;
      toast.success('Áudio enviado com sucesso!');
      state.audioFile = null;
    } catch (err: any) {
      handleUploadError(err);
    } finally {
      stop();
      state.progress = 0;
      state.cancelToken = null;
    }
  }

  function handleUploadProgress(evt: AxiosProgressEvent): void {
    if (evt.total) {
      state.progress = Math.round((evt.loaded / evt.total) * 100);
    }
  }

  function handleUploadError(err: any): void {
    if (axios.isCancel(err)) {
      toast.error('Envio cancelado pelo usuário.');
      return;
    }

    const status = err?.response?.status;
    const errorMsg = err?.response?.data?.error;
    const message = err?.response?.data?.message;

    if (status === 429 || errorMsg === 'Rate limit exceeded') {
      state.error =
        message ||
        'Você fez muitas transcrições em pouco tempo. Tente novamente em alguns minutos.';
      toast.error(state.error);
    } else {
      state.error = errorMsg || 'Erro ao transcrever áudio';
      toast.error(state.error);
    }
  }

  function handleFileChange(file: File): void {
    state.audioFile = file;
    state.error = '';
  }

  function cancelUpload(): void {
    if (state.cancelToken) {
      state.cancelToken.cancel('Cancelado pelo usuário');
    }
    resetState();
  }

  function resetErrorAndTranscript(): void {
    state.error = '';
    state.transcript = '';
  }

  function resetState(): void {
    state.audioFile = null;
    state.error = '';
    state.progress = 0;
    state.transcript = '';
    state.cancelToken = null;
  }

  return {
    loading,
    ...toRefs(state),
    handleUpload,
    handleFileChange,
    cancelUpload,
  };
}
