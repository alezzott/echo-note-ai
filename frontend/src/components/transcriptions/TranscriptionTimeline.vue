<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import TranscriptionCard from "./TranscriptionCard.vue";
import TranscriptionFilters from "./TranscriptionFilters.vue";
import { Loader2 } from "lucide-vue-next";
import { useTranscriptionStore } from "../../stores/transcriptions";
import { useFetchTranscriptions } from "../../composables/useFetchTranscriptions";
import { useLoading } from "../../composables/useLoading";


const transcriptionStore = useTranscriptionStore();
const filters = ref<{ search: string }>({ search: "" });
const { loading, start, stop } = useLoading();

async function fetchTranscriptions() {
  start();
  try {
	await new Promise(resolve => setTimeout(resolve, 1400));
    await useFetchTranscriptions();
  } finally {
    stop();
  }
}

onMounted(fetchTranscriptions);

function handleFilter(newFilters: { search: string }) {
  filters.value = newFilters;
}

const filteredTranscriptions = computed(() => {
  const searchTerm = filters.value.search?.toLowerCase() || "";
  if (!searchTerm) return transcriptionStore.transcriptions;
  return transcriptionStore.transcriptions.filter((t) =>
    t.transcript?.toLowerCase().includes(searchTerm),
  );
});
</script>

<template>
	<section>
		<TranscriptionFilters @filter="handleFilter" />
		<div v-if="loading" class="flex justify-center py-8">
			<Loader2 class="animate-spin w-32 h-32 text-orange-400" />
		</div>
		<div v-else>
			<div v-if="filteredTranscriptions.length === 0" class="text-gray-500 text-center py-8">
				Nenhuma transcrição encontrada.
			</div>
			<div class="flex flex-col gap-6">
				<TranscriptionCard v-for="transcription in filteredTranscriptions" :key="transcription._id"
					:transcription="transcription" />
			</div>
		</div>
	</section>
</template>