<script setup lang="ts">
import { FileAudio } from 'lucide-vue-next';
import { Input } from '../ui/input';

defineProps<{
  loading: boolean;
  audioFile: File | null;
  error: string;
}>();
const emit = defineEmits<{
  (e: 'fileChange', file: File): void;
  (e: 'cancelUpload'): void;
}>();

function handleFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  if (files && files[0]) {
    emit('fileChange', files[0]);
  }
}
</script>

<template>
  <div>
    <label
      class="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-100 py-8 px-8 cursor-pointer transition hover:border-orange-400"
      :class="{ 'opacity-60 pointer-events-none': loading }"
      @dragover.prevent
      @drop.prevent="
        (e) => {
          if (!loading) handleFileChange(e);
        }
      "
    >
      <FileAudio class="w-16 h-16 text-[#fb923c]" />
      <span
        class="text-md font-semibold text-gray-700 text-center m-auto flex gap-2"
      >
        Selecione o seu arquivo de áudio para começar a transcrição.
      </span>
      <Input
        type="file"
        accept="audio/wav,audio/mpeg,audio/mp4,audio/aac,audio/x-m4a,audio/m4a,audio/webm"
        class="hidden"
        :disabled="loading"
        @change="handleFileChange"
      />
    </label>
  </div>
</template>
