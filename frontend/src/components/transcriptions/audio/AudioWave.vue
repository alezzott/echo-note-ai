<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps<{
  active: boolean;
  color?: string;
}>();

const containerRef = ref<HTMLElement | null>(null);
const bars = ref(10);
const barHeights = ref<number[]>([]);
const maxBarHeight = 40;
let intervalId: number | null = null;
let offset = 0;

const BASE_HEIGHTS = [
  8, 20, 70, 20, 40, 20, 40, 20, 70, 20, 8, 80, 64, 30, 60, 50, 80, 40, 90, 74,
  40, 80, 20, 70, 20, 40, 20, 40, 20, 70,
];

function normalizeHeights(heights: number[], maxHeight: number): number[] {
  const maxBase = Math.max(...heights);
  return heights.map((h) => Math.max(4, Math.floor((h / maxBase) * maxHeight)));
}

function getBarCount(
  container: HTMLElement | null,
  barWidth = 10,
  minBars = 20,
): number {
  if (!container) return minBars;
  return Math.max(minBars, Math.floor(container.offsetWidth / barWidth));
}

function updateBars() {
  bars.value = getBarCount(containerRef.value);
}

function setBarHeights(active: boolean) {
  if (active) {
    const heights = normalizeHeights(BASE_HEIGHTS, maxBarHeight);
    barHeights.value = Array.from(
      { length: bars.value },
      (_, i) => heights[(i + offset) % heights.length],
    );
    offset = (offset + 1) % heights.length;
  } else {
    barHeights.value = Array(bars.value).fill(2);
  }
}

onMounted(() => {
  updateBars();
  window.addEventListener('resize', updateBars);
  setBarHeights(false);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateBars);
  if (intervalId) clearInterval(intervalId);
});

watch(containerRef, updateBars);

watch(
  () => props.active,
  (active) => {
    if (intervalId) clearInterval(intervalId);
    if (active) {
      intervalId = window.setInterval(() => setBarHeights(true), 80);
    } else {
      setBarHeights(false);
    }
  },
  { immediate: true },
);

watch(bars, () => setBarHeights(props.active));
</script>

<template>
  <span ref="containerRef" class="flex h-6 items-center justify-between">
    <span
      v-for="(height, idx) in barHeights"
      :key="idx"
      class="rounded-md"
      :style="{
        height: `${height}px`,
        background: color,
        width: '4px',
        opacity: 0.9,
        transition: 'height 0.6s cubic-bezier(0.4, 0.8, 0.6, 1)',
        marginTop: `${(maxBarHeight - height) / 2}px`,
        marginBottom: `${(maxBarHeight - height) / 2}px`,
      }"
    ></span>
  </span>
</template>
