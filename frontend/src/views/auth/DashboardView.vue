<script setup lang="ts">
import { onMounted, ref } from "vue";
import MainHeader from "../../components/dashboard/MainHeader.vue";
import TranscriptionTimeline from "../../components/transcriptions/TranscriptionTimeline.vue";

const tab = ref("transcriptions");
function handleTabChange(newTab: string) {
  tab.value = newTab;
}
</script>

<template>
  <div class="min-h-screen bg-[#fafafa]">
    <MainHeader :activeTab="tab" @changeTab="handleTabChange" />
    <main class="p-8">
      <div>
        <TranscriptionTimeline v-if="tab === 'transcriptions'" />
      </div>
    </main>
  </div>
</template>