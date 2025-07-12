<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next';

defineProps<{
  loading: boolean;
  transcript: string;
}>();
</script>

<template>
  <div class="bg-gray-50 rounded-lg p-6 border border-gray-100 flex flex-col gap-4 flex-1 w-full">
    <h2 class="text-lg font-semibold mb-2">Texto transcrito</h2>
    <div v-if="loading" class="flex items-center gap-2 text-orange-400">
      <Loader2 class="animate-spin w-5 h-5" /> Transcrevendo...
    </div>
    <div v-else-if="transcript" class="whitespace-pre-line break-words w-full text-gray-800">
      {{ transcript }}
    </div>
    <div v-else class="text-gray-400">Nenhum texto transcrito ainda.</div>
  </div>
</template>