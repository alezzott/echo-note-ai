<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "../../stores/user";
import { useLoading } from "../../composables/useLoading";
import { Progress } from "../ui/progress";
import { toast } from "vue-sonner";
import { transcribeAudio } from "../../api/create-transcription";
import AudioUpload from "./AudioUpload.vue";
import TranscriptionResult from "./TranscriptionResult.vue";
import axios, { type CancelTokenSource } from "axios";
import AudioRecorder from "./AudioRecorder.vue";
import { Loader2 } from "lucide-vue-next";

const userStore = useUserStore();
const { loading, start, stop } = useLoading();

const audioFile = ref<File | null>(null);
const transcript = ref("");
const error = ref("");
const progress = ref(0);
const cancelToken = ref<CancelTokenSource | null>(null);

async function handleUpload() {
  if (!audioFile.value) return;
  start();
  error.value = "";
  transcript.value = "";
  progress.value = 0;
  cancelToken.value = axios.CancelToken.source();

  try {
    const response = await transcribeAudio({
      audioFile: audioFile.value,
      token: userStore.token ?? "",
      cancelToken: cancelToken.value,
      onUploadProgress: (evt) => {
        if (evt.total) {
          progress.value = Math.round((evt.loaded / evt.total) * 100);
        }
      },
    });
    transcript.value = response.text;
    toast.success("Audio enviado com sucesso !");
  } catch (err: any) {
    if (axios.isCancel(err)) {
      toast.error("Envio cancelado pelo usuário.");
    } else {
      error.value = err?.response?.data?.error || "Erro ao transcrever áudio";
      toast.error("Erro ao enviar áudio, tente novamente");
    }
  } finally {
    stop();
    progress.value = 0;
    cancelToken.value = null;
  }
}

function handleFileChange(file: File) {
  audioFile.value = file;
  error.value = "";
}

function cancelUpload() {
  if (cancelToken.value) {
    cancelToken.value.cancel("Upload cancelado pelo usuário.");
    audioFile.value = null;
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8 border border-gray-200 flex flex-col h-full gap-8">
    <div class="bg-gray-50 rounded-lg p-6 border border-gray-100 flex flex-col gap-4">
      <h2 class="text-lg font-semibold mb-2">Enviar ou gravar áudio</h2>
      <AudioUpload
        :loading="loading"
        :audioFile="audioFile"
        :error="error"
        @fileChange="handleFileChange"
        @cancelUpload="cancelUpload"
      />
      <button @click="handleUpload" :disabled="!audioFile || loading"
        class="bg-orange-400 text-white px-4 py-2 rounded font-semibold hover:bg-orange-500 disabled:opacity-50 mt-4">
        <span v-if="loading">
          <Loader2 class="animate-spin w-5 h-5 inline mr-2" />
          Transcrevendo...
        </span>
        <span v-else>Enviar para transcrição</span>
      </button>
      <AudioRecorder @audioRecorded="handleFileChange" />
      <Progress v-if="progress > 0 && loading" :model-value="progress" class="mt-2 [&>div]:bg-orange-400" />
    </div>
    <TranscriptionResult :loading="loading" :transcript="transcript" />
  </div>
</template>