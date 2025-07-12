<script setup lang="ts">
import { Mic, Square } from "lucide-vue-next";
import { ref } from "vue";

const isRecording = ref(false);
const mediaRecorder = ref<MediaRecorder | null>(null);
const recordedChunks = ref<Blob[]>([]);
const error = ref("");
const duration = ref(0);
let timer: number | null = null;

const emit = defineEmits<{
    (e: "audioRecorded", file: File): void;
}>();



async function handleRecord() {
    if (!isRecording.value) {
        recordedChunks.value = [];
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.value = new MediaRecorder(stream);
            mediaRecorder.value.ondataavailable = (e) => {
                if (e.data.size > 0) recordedChunks.value.push(e.data);
            };
            mediaRecorder.value.onstop = () => {
                const audioBlob = new Blob(recordedChunks.value, { type: "audio/webm" });
                const now = new Date();
                const pad = (n: number) => n.toString().padStart(2, "0");
                const fileName = `gravacao-${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}_${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.webm`;
                const file = new File([audioBlob], fileName, { type: "audio/webm" });
                emit("audioRecorded", file);
                duration.value = 0;
            };
            mediaRecorder.value.start();
            isRecording.value = true;
            duration.value = 0;
            timer = window.setInterval(() => {
                duration.value += 1;
            }, 1000);
        } catch (err) {
            error.value = "Não foi possível acessar o microfone.";
        }
    } else {
        mediaRecorder.value?.stop();
        isRecording.value = false;
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    }
}

function handleStop() {
    mediaRecorder.value?.stop();
    isRecording.value = false;
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
}
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