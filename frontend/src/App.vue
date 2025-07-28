<template>
  <TooltipProvider>
    <Toaster richColors position="top-right" :duration="5000" />
    <RouterView />
  </TooltipProvider>
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner';
import 'vue-sonner/style.css';
import TooltipProvider from './components/ui/tooltip/TooltipProvider.vue';
</script>
