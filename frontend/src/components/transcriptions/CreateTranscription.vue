<script setup lang="ts">
import AudioUpload from './AudioUpload.vue';
import TranscriptionResult from './TranscriptionResult.vue';
import AudioRecorder from './AudioRecorder.vue';
import { useCreateTranscription } from '@/composables/useCreateTranscription';
import TooltipAudioInfo from './TooltipAudioInfo.vue';
import AudioList from './AudioList.vue';

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
  <div
    class="max-w-4xl mx-auto bg-white rounded-xl shadow-lg max-md:p-3 max-md:my-3 md:p-5 border border-gray-200 flex flex-col h-full gap-3"
  >
    <h2 class="text-lg font-semibold">Escolha como enviar seu áudio</h2>
    <div
      class="bg-gray-50 rounded-lg p-6 border border-gray-100 flex flex-col gap-3"
    >
      <span class="font-medium flex items-center gap-2"
        >Fazer upload de arquivo
        <TooltipAudioInfo />
      </span>
      <AudioUpload
        :loading="loading"
        :audioFile="audioFile"
        :error="error"
        @fileChange="handleFileChange"
        @cancelUpload="cancelUpload"
      />
      <div class="flex items-center">
        <span class="flex-1 border-t border-gray-500"></span>
        <span class="mx-3 text-gray-700 text-sm">ou</span>
        <span class="flex-1 border-t border-gray-500"></span>
      </div>
      <div>
        <AudioRecorder @audioRecorded="handleFileChange" />
      </div>
    </div>
    <AudioList
      :audioFile="audioFile"
      :loading="loading"
      :progress="progress"
      :error="error"
      @cancelUpload="cancelUpload"
      @handleUpload="handleUpload"
    />
    <TranscriptionResult
      :loading="false"
      :transcript="transcript"
      v-if="transcript"
    />
  </div>
</template>
