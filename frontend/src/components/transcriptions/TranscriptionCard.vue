<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '../ui/button';
import { FileDown, Loader2 } from 'lucide-vue-next';
import type { Transcription } from '../../stores/transcriptions';
import { useUserStore } from '../../stores/user';
import { useLoading } from '../../composables/useLoading';
import { exportTranscriptionById } from '@/api/export-id-transcription';
import DialogAllShowTranscriptions from './DialogAllShowTranscriptions.vue';

const props = defineProps<{ transcription: Transcription }>();

const dialogOpen = ref(false);
const userStore = useUserStore();
const { loading: exporting, start, stop } = useLoading();

async function handleExport(format: 'csv' | 'txt') {
  start();
  try {
    await exportTranscriptionById(
      props.transcription._id,
      format,
      props.transcription.filename,
      userStore.token ?? undefined,
    );
  } finally {
    stop();
  }
}
</script>

<template>
  <div
    v-if="transcription"
    class="bg-white rounded-lg shadow p-6 border border-gray-200"
  >
    <div class="flex justify-between items-center mb-2">
      <span class="font-semibold text-lg">{{
        transcription.filename || 'Sem nome'
      }}</span>
      <span class="text-xs text-gray-500">{{
        transcription.language || 'N/A'
      }}</span>
    </div>
    <div class="text-xs text-gray-400 mb-2">
      Criado em:
      {{
        transcription.createdAt
          ? new Date(transcription.createdAt).toLocaleString()
          : 'Data desconhecida'
      }}
    </div>
    <!-- Collapse para segmentos -->
    <div class="space-y-2 mt-2">
      <template v-if="(transcription.segments?.length || 0) > 4">
        <div
          v-for="segment in transcription.segments.slice(0, 4)"
          :key="segment._id"
          class="border-l-4 border-orange-400 pl-2 mb-2"
        >
          <div class="text-xs text-gray-500">
            {{ segment.start }}s - {{ segment.end }}s
          </div>
          <div class="text-sm">{{ segment.text }}</div>
        </div>
        <DialogAllShowTranscriptions
          :transcription="transcription"
          :dialogOpen="dialogOpen"
          @update:dialogOpen="dialogOpen = $event"
        />
      </template>
      <template v-else>
        <div
          v-for="segment in transcription.segments || []"
          :key="segment._id"
          class="border-l-4 border-orange-400 pl-2 mb-2"
        >
          <div class="text-xs text-gray-500">
            {{ segment.start }}s - {{ segment.end }}s
          </div>
          <div class="text-sm">{{ segment.text }}</div>
        </div>
      </template>
    </div>
    <div class="mt-4 flex justify-end items-center gap-5">
      <span class="text-xs text-gray-500">ID: {{ transcription._id }}</span>
      <Button
        @click="handleExport"
        size="icon"
        :disabled="exporting"
        class="bg-orange-400 cursor-pointer text-white rounded-md font-semibold hover:bg-orange-500 flex items-center justify-center"
      >
        <template v-if="exporting">
          <Loader2 class="animate-spin w-8 h-8" />
        </template>
        <template v-else>
          <FileDown class="w-10 h-10" />
        </template>
      </Button>
    </div>
  </div>
</template>
