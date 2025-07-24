<script setup lang="ts">
import Button from '../ui/button/Button.vue';
import Dialog from '../ui/dialog/Dialog.vue';
import DialogContent from '../ui/dialog/DialogContent.vue';
import DialogHeader from '../ui/dialog/DialogHeader.vue';
import DialogTitle from '../ui/dialog/DialogTitle.vue';
import DialogTrigger from '../ui/dialog/DialogTrigger.vue';

const props = defineProps<{
  transcription: any;
  dialogOpen: boolean;
}>();
const emit = defineEmits(['update:dialogOpen']);
</script>
<template>
  <Dialog :open="dialogOpen" @update:open="emit('update:dialogOpen', $event)">
    <section class="flex justify-end py-2">
      <DialogTrigger as-child>
        <Button
          type="button"
          aria-label="Mostrar todos os segmentos da transcrição"
          class="bg-[#fb923c] hover:bg-[#fdba74] cursor-pointer"
          variant="default"
        >
          Mostrar todos ({{ props.transcription.segments.length }})
        </Button>
      </DialogTrigger>
    </section>
    <DialogContent>
      <DialogHeader>
        <DialogTitle as="h2">Todos os Segmentos</DialogTitle>
      </DialogHeader>
      <div class="space-y-2 mt-2 max-h-[60vh] overflow-y-auto">
        <div
          v-for="segment in props.transcription.segments"
          :key="segment._id"
          class="border-l-4 border-orange-400 pl-2 mb-2"
        >
          <div class="text-xs text-gray-500">
            {{ segment.start }}s - {{ segment.end }}s
          </div>
          <div class="text-sm">{{ segment.text }}</div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
