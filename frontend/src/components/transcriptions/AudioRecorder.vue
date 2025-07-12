<script setup lang="ts">
import { Mic, Square } from "lucide-vue-next";
import { useAudioRecorder } from "../../composables/useAudioRecorder";

const emit = defineEmits<{
    (e: "audioRecorded", file: File): void;
}>();

const {
    isRecording,
    error,
    duration,
    handleRecord,
    handleStop,
} = useAudioRecorder(emit);
</script>



<template>
    <div class="flex max-md:flex-col flex-row items-center justify-center gap-3 w-full">
        <button @click="handleRecord" :disabled="isRecording"
            class="flex-1 w-full flex items-center justify-center gap-2 cursor-pointer text-gray-700 px-3 py-2 rounded font-semibold bg-gray-200 hover:bg-gray-300 transition disabled:opacity-60 disabled:cursor-default min-w-[140px]">
            <Mic v-if="!isRecording" class="w-6 h-6" />
            <span v-if="!isRecording">Gravar áudio</span>
            <span v-else class="flex items-center gap-2 ml-1">
                <!-- Ondas animadas menores -->
                <span class="flex gap-0.5 h-4 items-end">
                    <span class="w-1 h-2 bg-orange-400 rounded animate-wave"></span>
                    <span class="w-1 h-3 bg-orange-400 rounded animate-wave delay-100"></span>
                    <span class="w-1 h-2 bg-orange-400 rounded animate-wave delay-200"></span>
                    <span class="w-1 h-4 bg-orange-400 rounded animate-wave delay-300"></span>
                    <span class="w-1 h-2 bg-orange-400 rounded animate-wave delay-400"></span>
                </span>
                <span class="ml-1 text-orange-500 font-semibold animate-pulse">
                    Gravando... {{ duration }}s
                </span>
            </span>
        </button>
        <button v-if="isRecording" @click="handleStop"
            class="cursor-pointer max-md:w-full flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded font-semibold bg-orange-400 text-white hover:bg-orange-500 transition min-w-[140px]">
            <Square class="w-6 h-6" />
            <span class="hidden sm:inline">Parar gravação</span>
        </button>
        <div v-if="error" class="text-red-500 mt-2 w-full text-center text-sm">{{ error }}</div>
    </div>
</template>

<style scoped>
@keyframes wave {

    0%,
    100% {
        transform: scaleY(1);
    }

    50% {
        transform: scaleY(2);
    }
}

.animate-wave {
    animation: wave 1s infinite;
}

.delay-100 {
    animation-delay: 0.1s;
}

.delay-200 {
    animation-delay: 0.2s;
}

.delay-300 {
    animation-delay: 0.3s;
}

.delay-400 {
    animation-delay: 0.4s;
}
</style>

<style scoped>
@keyframes wave {

    0%,
    100% {
        transform: scaleY(1);
    }

    50% {
        transform: scaleY(2);
    }
}

.animate-wave {
    animation: wave 1s infinite;
}

.delay-100 {
    animation-delay: 0.1s;
}

.delay-200 {
    animation-delay: 0.2s;
}

.delay-300 {
    animation-delay: 0.3s;
}

.delay-400 {
    animation-delay: 0.4s;
}
</style>