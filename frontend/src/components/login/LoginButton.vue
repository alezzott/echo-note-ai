<script setup lang="ts">
/** biome-ignore-all lint/correctness/noUnusedImports: <explanation> */

import { Loader2 } from "lucide-vue-next";
import GoogleIcon from "../../assets/login/google-logo.svg";
import Button from "../ui/button/Button.vue";

defineProps<{
	loading: boolean;
	onClick: () => void;
}>();
</script>

<template>
    <Button :disabled="loading" aria-label="Entrar com Google"
        class="w-64 h-11 m-auto flex items-center justify-center gap-3 rounded-[20px] font-medium text-[#1f1f1f] text-lg"
        @click="onClick" variant="outline">
        <span class="flex items-center justify-center h-5 mr-3 min-w-[20px]">
            <template v-if="loading">
                <Loader2 class="w-6 h-6 mr-2 animate-spin" />
            </template>
            <template v-else>
                <img :src="GoogleIcon" alt="Google" class="w-5 h-5" draggable="false" />
            </template>
        </span>
        <span class="flex-grow text-ellipsis overflow-hidden text-center font-semibold cursor-pointer">
            <span v-if="loading">Aguarde...</span>
            <span v-else>Entrar com Google</span>
        </span>
    </Button>
</template>