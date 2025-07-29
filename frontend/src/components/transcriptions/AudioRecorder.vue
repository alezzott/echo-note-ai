<script setup lang="ts">
import { Mic, SendHorizontal, X } from 'lucide-vue-next';
import { useAudioRecorder } from '../../composables/useAudioRecorder';
import Button from '../ui/button/Button.vue';

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
  <div class="flex flex-row items-center justify-center gap-3">
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

    <section v-if="isRecording" class="flex-1 flex justify-center">
      <span class="flex items-center gap-2 ml-1">
        <span class="flex gap-0.5 h-4 items-end">
          <span class="w-1 h-2 bg-orange-400 rounded animate-wave"></span>
          <span
            class="w-1 h-3 bg-orange-400 rounded animate-wave delay-100"
          ></span>
          <span
            class="w-1 h-2 bg-orange-400 rounded animate-wave delay-200"
          ></span>
          <span
            class="w-1 h-4 bg-orange-400 rounded animate-wave delay-300"
          ></span>
          <span
            class="w-1 h-2 bg-orange-400 rounded animate-wave delay-400"
          ></span>
        </span>
        <span class="ml-1 text-black font-semibold animate-pulse">
          {{ formattedDuration }}
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

<style scoped>
@keyframes wave {
  0%,
  100% {
    transform: scaleY(1);
  }

  50% {
    transform: scaleY(2);
  }
}

.animate-wave {
  animation: wave 1s infinite;
}

.delay-100 {
  animation-delay: 0.1s;
}

.delay-200 {
  animation-delay: 0.2s;
}

.delay-300 {
  animation-delay: 0.3s;
}

.delay-400 {
  animation-delay: 0.4s;
}
</style>
