<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/user";
import { Menu } from "lucide-vue-next";
import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";

type Tab = {
  label: string;
  value: string;
};

const props = defineProps<{ activeTab: string }>();
const emit = defineEmits(["changeTab"]);

const userStore = useUserStore();
const router = useRouter();

const tabs = ref<Tab[]>([
  { label: "Minhas Transcrições", value: "transcriptions" },
  { label: "Criar Transcrição", value: "create-transcriptions" }
]);

const drawerOpen = ref(false);

function logout(): void {
  userStore.clearUser();
  router.push("/login");
}
</script>

<template>
  <header class="flex items-center justify-between px-4 py-3 bg-white shadow-sm">
    <!-- Mobile: Menu Hamburguer -->
    <div class="flex items-center gap-2 md:hidden">
      <button @click="drawerOpen = true" class="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
        <Menu class="w-6 h-6 text-gray-700" />
      </button>
      <div class="shadow-2xl rounded-full px-4">
          <svg
            class="w-6 h-6 text-[#fb923c]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 19V6m6 12V6m-9 9v-6m12 6v-6"/>
          </svg>
        </div>
      <span class="text-base font-semibold text-gray-700">EchoNoteAI</span>
    </div>

    <!-- Desktop: Navegação Horizontal -->
    <nav class="hidden md:flex gap-2">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        :class="[
          'px-4 py-2 rounded-lg font-medium transition',
          props.activeTab === tab.value
            ? 'bg-[#fb923c] text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
        @click="emit('changeTab', tab.value)"
      >
        {{ tab.label }}
      </button>
    </nav>

    <!-- Perfil e Logout -->
    <div class="flex items-center gap-3">
      <span class="hidden md:inline text-base font-medium text-gray-700">
        Olá, {{ userStore.user?.name || 'Usuário' }}
      </span>
      <img
        v-if="userStore.user?.photoURL"
        :src="userStore.user.photoURL"
        alt="Avatar"
        class="w-9 h-9 rounded-full object-cover border"
      />
      <button
        @click="logout"
        class="px-3 py-1 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold transition"
      >
        Sair
      </button>
    </div>

    <!-- Drawer Mobile -->
    <Drawer v-model:open="drawerOpen">
      <DrawerContent class="p-0">
        <DrawerHeader class="flex items-center justify-between px-4 py-3 border-b">
        </DrawerHeader>
        <nav class="flex flex-col gap-2 px-4 py-4">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            :class="[
              'px-4 py-2 rounded-lg font-medium transition text-left',
              props.activeTab === tab.value
                ? 'bg-[#fb923c] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            ]"
            @click="emit('changeTab', tab.value); drawerOpen = false"
          >
            {{ tab.label }}
          </button>
        </nav>
        
        <button
          @click="logout"
          class="w-full mt-2 px-3 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold transition"
        >
          Sair
        </button>
      </DrawerContent>
    </Drawer>
  </header>
</template>