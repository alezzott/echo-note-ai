<script setup lang="ts">
import { ref } from "vue";
import { exportAllToTxt } from "../../lib/export-all-to-txt";
import { useTranscriptionStore } from "../../stores/transcriptions";

import { useFetchTranscriptions } from "../../composables/useFetchTranscriptions";

const emits = defineEmits(["filter"]);
const search = ref("");

const transcriptionStore = useTranscriptionStore(); // <-- CORRIGIDO
useFetchTranscriptions();

function applyFilters() {
  emits("filter", { search: search.value });
}

function clearSearch() {
  search.value = "";
  emits("filter", { search: "" });
}

</script>

<template>
  <form @submit.prevent="applyFilters" class="flex flex-wrap items-center gap-2 mb-4">
    <input
      v-model="search"
      type="text"
      placeholder="Buscar texto da transcrição"
      class="border rounded-md px-3 py-2 bg-white flex-1 max-w-full"
    />
    <button
      v-if="search"
      type="button"
      @click="clearSearch"
      class="bg-gray-200 text-gray-700 px-4 py-2 rounded-md border hover:bg-gray-300"
    >
      Limpar
    </button>
    <button type="submit" class="bg-orange-400 text-white cursor-pointer hover:bg-orange-500 px-4 py-2 rounded-md font-semibold">
      Filtrar
    </button>
    <button
      @click="exportAllToTxt(transcriptionStore.transcriptions)"
      :disabled="!transcriptionStore.transcriptions.length"
      class="bg-orange-400 text-white px-4 py-2 rounded-md cursor-pointer font-semibold hover:bg-orange-500 disabled:opacity-50"
    >
      Exportar todas para .txt
    </button>
  </form>
</template>