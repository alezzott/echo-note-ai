<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import TranscriptionCard from './TranscriptionCard.vue';
import TranscriptionFilters from './TranscriptionFilters.vue';
import { Loader2 } from 'lucide-vue-next';
import { useTranscriptionStore } from '../../stores/transcriptions';
import { useFetchTranscriptions } from '@/composables/useFetchTranscriptions';
import { useInfiniteScroll } from '@/composables/useInfiniteScroll';

const transcriptionStore = useTranscriptionStore();
const filters = ref<{ search: string }>({ search: '' });
const { loading, hasMore, fetchTranscriptions } = useFetchTranscriptions();
const scrollLoading = ref(false);

const filteredTranscriptions = computed(() => {
  const searchTerm = filters.value.search?.toLowerCase() || '';
  if (!searchTerm) return transcriptionStore.transcriptions;
  return transcriptionStore.transcriptions.filter((t) =>
    t.transcript?.toLowerCase().includes(searchTerm),
  );
});

async function handleFilter(newFilters: { search: string }) {
  filters.value = newFilters;
  await fetchTranscriptions({ reset: true });
}

let isFetching = false;

async function fetchMoreTranscriptions() {
  if (isFetching) return;
  isFetching = true;
  scrollLoading.value = true;
  await fetchTranscriptions();
  scrollLoading.value = false;
  isFetching = false;
}

onMounted(() => {
  fetchTranscriptions({ reset: true });
});

useInfiniteScroll(
  () => {
    if (!loading.value && !scrollLoading.value && hasMore.value) {
      fetchMoreTranscriptions();
    }
  },
  {
    enabled: () => !loading.value && !scrollLoading.value && hasMore.value,
    offset: 200,
  },
);
</script>

<template>
  <main>
    <section
      aria-labelledby="transcription-list-title"
      class="max-lg:mt-4 max-lg:px-2"
    >
      <header class="mb-4">
        <h1
          id="transcription-list-title"
          class="text-2xl font-bold text-gray-800"
        >
          Minhas Transcrições
        </h1>
        <section class="pt-4">
          <TranscriptionFilters @filter="handleFilter" />
        </section>
      </header>

      <div
        v-if="loading && !transcriptionStore.transcriptions.length"
        class="flex justify-center py-8"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <span class="sr-only">Carregando transcrições...</span>
        <Loader2
          class="animate-spin w-32 h-32 text-orange-400"
          aria-hidden="true"
        />
      </div>

      <div v-else>
        <div
          v-if="filteredTranscriptions.length === 0"
          class="text-gray-600 text-center py-8"
          role="status"
          aria-live="polite"
        >
          Nenhuma transcrição encontrada.
        </div>

        <ul class="flex flex-col gap-6" aria-live="polite">
          <li
            v-for="transcription in filteredTranscriptions"
            :key="transcription._id"
          >
            <TranscriptionCard :transcription="transcription" />
          </li>
        </ul>

        <div
          v-if="scrollLoading"
          class="flex justify-center py-4"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <span class="sr-only">Carregando mais transcrições...</span>
          <Loader2
            class="animate-spin w-32 h-32 text-orange-400"
            aria-hidden="true"
          />
        </div>

        <div
          v-if="!hasMore && transcriptionStore.transcriptions.length"
          class="text-center text-gray-600 py-8"
          role="status"
          aria-live="polite"
        >
          Todas as transcrições foram carregadas.
        </div>
      </div>
    </section>
  </main>
</template>
