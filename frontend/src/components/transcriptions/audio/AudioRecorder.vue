<script setup lang="ts">
import { Mic, SendHorizontal, X } from 'lucide-vue-next';
import { useAudioRecorder } from '../../../composables/useAudioRecorder';
import Button from '@/components/ui/button/Button.vue';
import AudioWave from './AudioWave.vue';

const emit = defineEmits<{
  (e: 'audioRecorded', file: File): void;
  (e: 'cancelUpload'): void;
}>();

const {
  isRecording,
  formattedDuration,
  error,
  handleRecord,
  handleStop,
  handleCancel,
} = useAudioRecorder(emit);
</script>

<template>
  <div class="flex items-center justify-center gap-3">
    <Button
      v-if="!isRecording"
      @click="handleRecord"
      :disabled="isRecording"
      size="lg"
      class="cursor-pointer gap-3 text-zinc-50 bg-orange-400 hover:bg-orange-300 transition disabled:opacity-60 disabled:cursor-default"
    >
      <Mic class="text-gray-100" :size="28" aria-hidden="true" />
      <span class="font-medium text-lg">Gravar áudio</span>
    </Button>

    <Button
      v-if="isRecording"
      @click="handleCancel"
      size="lg"
      variant="destructive"
      class="cursor-pointer font-semibold text-white transition"
      title="cancelar transcrição"
    >
      <X :size="28" />
    </Button>

    <section v-if="isRecording" class="w-full">
      <span class="flex gap-2">
        <span class="text-black font-semibold">
          {{ formattedDuration }}
        </span>
        <span class="flex-auto">
          <AudioWave :active="isRecording" color="#fb923c" />
        </span>
      </span>
    </section>

    <Button
      v-if="isRecording"
      @click="handleStop"
      size="lg"
      title="enviar"
      class="cursor-pointer bg-orange-400 text-white hover:bg-orange-500 transition"
    >
      <SendHorizontal :size="28" />
    </Button>
    <div v-if="error" class="text-red-500 mt-2 w-full text-center text-sm">
      {{ error }}
    </div>
  </div>
</template>
