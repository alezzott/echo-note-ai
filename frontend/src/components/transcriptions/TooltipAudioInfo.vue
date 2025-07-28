<script setup lang="ts">
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-vue-next';
</script>

<template>
  <Tooltip>
    <TooltipTrigger as-child>
      <button class="cursor-pointer">
        <Info :size="18" class="hover:text-orange-400" />
      </button>
    </TooltipTrigger>
    <TooltipContent>
      <span>
        Formatos suportados: WAV, MPEG, MP4, AAC, M4A, X-M4A.<br />
        Outros formatos não serão aceitos no upload.
      </span>
    </TooltipContent>
  </Tooltip>
</template>
