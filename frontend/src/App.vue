<template>
  <Toaster richColors position="top-right" :duration="5000"/>
  <RouterView />
</template>

<script setup lang="ts">
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import { Toaster } from "vue-sonner";
import "vue-sonner/style.css";
</script>