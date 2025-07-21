<script setup lang="ts">
import { ref } from 'vue';
import { useTranscriptionStore } from '../../stores/transcriptions';
import { useFetchTranscriptions } from '../../composables/useFetchTranscriptions';
import { exportAllToTxt } from '@/lib/shared/export-all-to-txt';
import { DropdownMenuTrigger } from '../ui/dropdown-menu';
import DropdownMenuContent from '../ui/dropdown-menu/DropdownMenuContent.vue';
import DropdownMenuItem from '../ui/dropdown-menu/DropdownMenuItem.vue';
import DropdownMenu from '../ui/dropdown-menu/DropdownMenu.vue';
import { exportAllToCsv } from '@/lib/shared/export-all-to-csv';
import Button from '../ui/button/Button.vue';

const emits = defineEmits(['filter']);
const search = ref('');

const transcriptionStore = useTranscriptionStore();
useFetchTranscriptions();

function applyFilters() {
  emits('filter', { search: search.value });
}

function clearSearch() {
  search.value = '';
  emits('filter', { search: '' });
}

function handleExport(format: 'txt' | 'csv') {
  if (format === 'txt') {
    exportAllToTxt(transcriptionStore.transcriptions);
  } else if (format === 'csv') {
    exportAllToCsv(transcriptionStore.transcriptions);
  }
}
</script>

<template>
  <form
    @submit.prevent="applyFilters"
    class="flex flex-wrap items-center gap-2 mb-4"
  >
    <input
      v-model="search"
      type="text"
      placeholder="Buscar texto da transcrição"
      class="border rounded-md px-3 py-2 bg-white flex-1 max-w-full"
    />
    <Button
      v-if="search"
      type="button"
      @click="clearSearch"
      class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md border hover:bg-gray-300"
    >
      Limpar
    </Button>
    <Button
      :disabled="!search"
      type="submit"
      class="bg-orange-400 text-white cursor-pointer hover:bg-orange-500 px-4 py-2 rounded-md font-semibold"
    >
      Filtrar
    </Button>
    <DropdownMenu>
      <DropdownMenuTrigger
        class="bg-orange-400 text-white px-4 py-1.5 rounded-md cursor-pointer font-semibold hover:bg-orange-500 disabled:opacity-50"
        :disabled="!transcriptionStore.transcriptions.length"
      >
        Exportar
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem @click="handleExport('txt')">
          Exportar todas para .txt
        </DropdownMenuItem>
        <DropdownMenuItem @click="handleExport('csv')">
          Exportar todas para .csv
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </form>
</template>
