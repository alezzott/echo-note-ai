<script setup lang="ts">
/** biome-ignore-all lint/correctness/noUnusedImports: <explanation> */

import LoginButton from "../../components/login/LoginButton.vue";
import LoginHeader from "../../components/login/LoginHeader.vue";
import { useAuth } from "../../composables/useAuth";
import { useLoading } from "../../composables/useLoading";

const { loginWithGoogle, error } = useAuth();
const { loading, start, stop } = useLoading();

async function handleLogin() {
  start();
  try {
    await loginWithGoogle();
  } finally {
    stop();
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col md:flex-row">
    <LoginHeader />
    <section class="flex-1 flex items-center justify-center p-8">
      <div class="w-full max-w-md space-y-6">
        <div class="flex items-center justify-center gap-2">
        <div class="shadow-2xl rounded-full p-2">
          <svg
            class="w-10 h-10 text-[#fb923c]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 19V6m6 12V6m-9 9v-6m12 6v-6"/>
          </svg>
        </div>
        <h1 class="text-2xl font-semibold">EchoNoteAI</h1>
      </div>
        <p class="text-gray-800 text-center mb-4 text-lg font-semibold">
          Acesse sua conta Google para continuar
        </p>
        <LoginButton :loading="loading" :onClick="handleLogin" />
        <p v-if="error" class="text-red-600 text-center mt-4">{{ error }}</p>
      </div>
    </section>
  </div>
</template>