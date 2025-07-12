<script setup lang="ts">
import AudioUpload from "./AudioUpload.vue";
import TranscriptionResult from "./TranscriptionResult.vue";
import AudioRecorder from "./AudioRecorder.vue";
import { Loader2 } from "lucide-vue-next";
import { Progress } from "../ui/progress";
import { useCreateTranscription } from "@/composables/useCreateTranscription";

const {
    loading,
    audioFile,
    transcript,
    error,
    progress,
    handleUpload,
    handleFileChange,
    cancelUpload,
} = useCreateTranscription();
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