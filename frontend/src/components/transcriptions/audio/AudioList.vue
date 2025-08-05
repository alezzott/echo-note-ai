<script setup lang="ts">
import { FileAudio, Loader2, SendHorizontal, X } from 'lucide-vue-next';
import { Progress } from '../../ui/progress';
import Button from '@/components/ui/button/Button.vue';
import FadeTransition from '@/components/ui/animations/FadeTransition.vue';

defineProps<{
  audioFile: File | null;
  loading: boolean;
  progress: number;
  error: string;
}>();

const emit = defineEmits<{
  (e: 'cancelUpload'): void;
  (e: 'handleUpload'): void;
}>();
</script>

<template>
  <FadeTransition :show="!!audioFile">
    <section
      v-if="audioFile"
      class="bg-gray-50 rounded-lg p-6 border border-gray-100 gap-4 mb-4 mt-4"
    >
      <section class="flex flex-col">
        <div class="flex items-center justify-between gap-3">
          <FileAudio class="text-orange-400" :size="28" />
          <div class="flex-1">
            <div class="flex items-center gap-3">
              <span class="text-sm text-gray-700 font-medium">
                {{ audioFile.name }}
              </span>
            </div>
            <Progress
              v-if="progress > 0 && loading"
              :model-value="progress"
              class="mt-1 [&>div]:bg-orange-400"
            />
          </div>
          <div class="flex items-center h-auto">
            <Button
              v-if="loading"
              @click="emit('cancelUpload')"
              size="icon"
              variant="destructive"
              class="text-white rounded font-semibold cursor-pointer"
            >
              <X :size="20" />
            </Button>
          </div>
        </div>
      </section>
      <section class="flex justify-end mt-4">
        <Button
          @click="emit('handleUpload')"
          :disabled="!audioFile || loading"
          class="bg-orange-400 text-white text-md hover:bg-orange-500 mt-1 cursor-pointer"
        >
          <span v-if="loading">
            <Loader2 :size="28" class="animate-spin inline w-4 h-4 mr-2`" />
            transcrevendo ...
          </span>
          <span v-else>enviar transcrição</span>
          <SendHorizontal :size="28" v-if="!loading" />
        </Button>
      </section>
    </section>
  </FadeTransition>
</template>
