import { reactive, toRefs } from "vue";
import axios, { type CancelTokenSource } from "axios";
import { toast } from "vue-sonner";
import { transcribeAudio } from "../api/create-transcription";
import { useLoading } from "./useLoading";
import { useUserStore } from "../stores/user";

export function useCreateTranscription() {
  const userStore = useUserStore();
  const { loading, start, stop } = useLoading();

  const state = reactive({
    audioFile: null as File | null,
    transcript: "",
    error: "",
    progress: 0,
    cancelToken: null as CancelTokenSource | null,
  });

  async function handleUpload() {
    if (!state.audioFile) return;
    start();
    state.error = "";
    state.transcript = "";
    state.progress = 0;
    state.cancelToken = axios.CancelToken.source();

    try {
      const response = await transcribeAudio({
        audioFile: state.audioFile,
        token: userStore.token ?? "",
        cancelToken: state.cancelToken,
        onUploadProgress: (evt) => {
          if (evt.total) {
            state.progress = Math.round((evt.loaded / evt.total) * 100);
          }
        },
      });
      state.transcript = response.text;
      toast.success("Audio enviado com sucesso!");
    } catch (err: any) {
      if (axios.isCancel(err)) {
        toast.error("Envio cancelado pelo usuário.");
      } else {
        state.error = err?.response?.data?.error || "Erro ao transcrever áudio";
        toast.error("Erro ao enviar áudio, tente novamente");
      }
    } finally {
      stop();
      state.progress = 0;
      state.cancelToken = null;
    }
  }

  function handleFileChange(file: File) {
    state.audioFile = file;
    state.error = "";
  }

  function cancelUpload() {
    if (state.cancelToken) {
      state.cancelToken.cancel("Upload cancelado pelo usuário.");
      state.audioFile = null;
    }
  }

  return {
    loading,
    ...toRefs(state),
    handleUpload,
    handleFileChange,
    cancelUpload,
  };
}