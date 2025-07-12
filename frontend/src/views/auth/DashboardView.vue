<script setup lang="ts">
import { ref } from "vue";
import MainHeader from "../../components/dashboard/MainHeader.vue";
import TranscriptionTimeline from "../../components/transcriptions/TranscriptionTimeline.vue";
import CreateTranscription from "../../components/transcriptions/CreateTranscription.vue";

const tab = ref("transcriptions");
function handleTabChange(newTab: string) {
  tab.value = newTab;
}
</script>

<template>
  <div class="min-h-screen bg-[#fafafa]">
    <MainHeader :activeTab="tab" @changeTab="handleTabChange" />
     <main class="max-md:p-2 md:p-8">
      <div v-if="tab === 'transcriptions'">
        <TranscriptionTimeline />
      </div>
      <div v-else-if="tab === 'create-transcriptions'">
        <CreateTranscription />
      </div>
    </main>
  </div>
</template>