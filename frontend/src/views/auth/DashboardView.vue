<script setup lang="ts">
/** biome-ignore-all lint/correctness/noUnusedImports: <explanation> */
import { ref } from "vue";
import MainHeader from "../../components/dashboard/MainHeader.vue";
import TranscriptionTimeline from "../../components/transcriptions/TranscriptionTimeline.vue";

const _tab = ref("transcriptions");
</script>

<template>
  <div class="min-h-screen bg-[#fafafa]">
    <MainHeader />
    <main class="p-8">
      <!-- Aqui vão as tabelas/tabs, que você vai detalhar depois -->
      <div>
        <TranscriptionTimeline  />
        <!-- Exemplo: <TranscriptionsTable v-if="tab === 'transcriptions'" /> -->
        <!-- Exemplo: <ExportTable v-if="tab === 'export'" /> -->
      </div>
    </main>
  </div>
</template>