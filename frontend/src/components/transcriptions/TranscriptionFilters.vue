<script setup lang="ts">
import { ref } from "vue";

const emits = defineEmits(["filter"]);

const search = ref("");

function applyFilters() {
  emits("filter", { search: search.value });
}

function clearSearch() {
  search.value = "";
  emits("filter", { search: "" });
}
</script>

<template>
  <form @submit.prevent="applyFilters" class="flex gap-2 mb-4">
    <input
      v-model="search"
      type="text"
      placeholder="Buscar texto da transcrição"
      class="border rounded px-2 py-1 w-96 bg-white"
    />
     <button
      v-if="search"
      type="button"
      @click="clearSearch"
      class="bg-gray-200 text-gray-700 px-3 py-1 rounded border hover:bg-gray-300"
    >
      Limpar
    </button>
    <button type="submit" class="bg-orange-400 text-white px-3 py-1 rounded">Filtrar</button>
  </form>
</template>