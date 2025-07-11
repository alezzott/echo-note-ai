<script setup lang="ts">
/** biome-ignore-all lint/correctness/noUnusedImports: <explanation> */

import LoginButton from "../../components/login/LoginButton.vue";
import LoginHeader from "../../components/login/LoginHeader.vue";
import { useAuth } from "../../composables/useAuth";

const { loginWithGoogle, loading, error } = useAuth();
</script>

<template>
  <div class="min-h-screen flex flex-col md:flex-row">
    <LoginHeader />
    <section class="flex-1 flex items-center justify-center bg-[#fafafa] p-8">
      <div class="w-full max-w-md space-y-6">
        <p class="text-gray-800 text-center mb-4 text-lg font-semibold">
          Acesse sua conta Google para continuar
        </p>
        <LoginButton :loading="loading" :onClick="loginWithGoogle" />
        <p v-if="error" class="text-red-600 text-center mt-4">{{ error }}</p>
      </div>
    </section>
  </div>
</template>