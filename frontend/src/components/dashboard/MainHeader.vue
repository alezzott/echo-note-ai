<script setup lang="ts">
/** biome-ignore-all lint/correctness/noUnusedVariables: <explanation> */
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/user";

type Tab = {
	label: string;
	value: string;
};

const userStore = useUserStore();
const router = useRouter();

const tabs = ref<Tab[]>([
	{ label: "Minhas Transcrições", value: "transcriptions" },
	{ label: "Exportar", value: "export" },
	// Adicione mais tabs conforme necessário
]);
const activeTab = ref(tabs.value[0].value);

function logout(): void {
	userStore.clearUser();
	router.push("/login");
}
</script>

<template>
  <header class="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
    <nav class="flex gap-2">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition',
          activeTab === tab.value
            ? 'bg-[#fb923c] text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
      </button>
    </nav>
    <div class="flex items-center gap-4">
      <span class="text-base font-medium text-gray-700">
        Olá, {{ userStore.user?.name || 'Usuário' }}
      </span>
      <img
        v-if="userStore.user?.photoURL"
        :src="userStore.user.photoURL"
        alt="Avatar"
        class="w-10 h-10 rounded-full object-cover border"
      />
      <button
        @click="logout"
        class="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold transition"
      >
        Sair
      </button>
    </div>
  </header>
</template>