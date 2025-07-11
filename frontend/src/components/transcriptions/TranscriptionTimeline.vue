<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { getTranscriptions } from "../../api/get-user-transcriptions";
import { useUserStore } from "../../stores/user";
import TranscriptionCard from "./TranscriptionCard.vue";
import TranscriptionFilters from "./TranscriptionFilters.vue";

type Segment = {
	start: number;
	end: number;
	text: string;
	_id: string;
};

type Transcription = {
	_id: string;
	userId: string;
	filename: string;
	transcript: string;
	segments: Segment[];
	language: string;
	createdAt: string;
};

const transcriptions = ref<Transcription[]>([]);
const userStore = useUserStore();
const filters = ref<{ search: string }>({ search: "" });
const page = ref(1);
const totalPages = ref(1);

async function fetchTranscriptions() {
	if (!userStore.user || !userStore.token) return;
	const result = await getTranscriptions({
		userId: userStore.user.uid,
		token: userStore.token,
		page: page.value,
		limit: 10,
		sortBy: "createdAt",
		order: "asc",
	});
	transcriptions.value = result;
	totalPages.value = result.totalPages ?? 1;
}

onMounted(fetchTranscriptions);

function handleFilter(newFilters: { search: string }) {
	filters.value = newFilters;
	page.value = 1;
}

const filteredTranscriptions = computed(() => {
	const searchTerm = filters.value.search?.toLowerCase() || "";
	if (!searchTerm) return transcriptions.value;
	return transcriptions.value.filter((t) =>
		t.transcript?.toLowerCase().includes(searchTerm),
	);
});
</script>

<template>
  <section>
     <TranscriptionFilters @filter="handleFilter" />
	 <div v-if="filteredTranscriptions.length === 0" class="text-gray-500 text-center py-8">
      Nenhuma transcrição encontrada.
    </div>
    <div class="flex flex-col gap-6">
      <TranscriptionCard
        v-for="transcription in filteredTranscriptions"
        :key="transcription._id"
        :transcription="transcription"
      />
    </div>
  </section>
</template>