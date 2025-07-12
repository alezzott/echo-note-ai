<script setup lang="ts">
import { ref } from "vue";
import { FileAudio, Loader2 } from "lucide-vue-next";
import { Input } from "../ui/input";

defineProps<{
  loading: boolean;
  audioFile: File | null;
  error: string;
}>();
const emit = defineEmits<{
  (e: "fileChange", file: File): void;
  (e: "cancelUpload"): void;
}>();

function handleFileChange(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  if (files && files[0]) {
    emit("fileChange", files[0]);
  }
}
</script>

<template>
  <div>
    <label
      class="flex flex-col items-center justify-center gap-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-100 py-8 cursor-pointer transition hover:border-orange-400"
      :class="{ 'opacity-60 pointer-events-none': loading }"
      @dragover.prevent
      @drop.prevent="(e) => { if (!loading) handleFileChange(e); }"
    >
      <FileAudio class="w-16 h-16 text-[#fb923c]" />
      <span class="text-lg font-semibold text-gray-700 text-center">
        Selecione ou Arraste o arquivo de áudio para cá.
      </span>
      <span class="text-gray-500 text-center">
        Importe um arquivo de áudio.
        <span class="text-red-500 font-semibold">
          Apenas arquivos nos formatos: WAV, MPEG, MP4, AAC, M4A, X-M4A são aceitos.
        </span>
      </span>
      <Input
        type="file"
        accept="audio/wav,audio/mpeg,audio/mp4,audio/aac,audio/x-m4a,audio/m4a"
        class="hidden"
        :disabled="loading"
        @change="handleFileChange"
      />
    </label>
    <div v-if="audioFile" class="text-sm text-gray-700 mt-2 flex items-center gap-2">
      <FileAudio class="w-5 h-5 text-orange-400" />
      <span>{{ audioFile.name }}</span>
      <span v-if="loading" class="ml-2 text-orange-400 flex items-center">
        <Loader2 class="animate-spin w-4 h-4 mr-1" /> Enviando...
      </span>
    </div>
    <div v-if="loading" class="flex gap-2 mt-2">
      <button
        @click="emit('cancelUpload')"
        class="bg-red-500 text-white px-3 py-1 rounded font-semibold hover:bg-red-600"
      >
        Cancelar envio
      </button>
    </div>
    <div v-if="error" class="text-red-500 mt-2">{{ error }}</div>
  </div>
</template>