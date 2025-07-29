<script setup lang="ts">
defineProps<{
  show: boolean;
}>();
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-500"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <slot v-if="show" />
  </Transition>
</template>
