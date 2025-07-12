<script setup lang="ts">
import VoiceIllustrator from "../../assets/login/voice-illustrator.svg";
</script>

<template>
  <section class="flex-1/3 flex flex-col items-center justify-center bg-[#fb923c] p-8">
    <img
      :src="VoiceIllustrator"
      alt="Ilustração"
      class="w-[320px] lg:w-[540px] h-auto mb-6 object-contain"
      draggable="false"
    />
    <p class="text-white text-lg font-medium">
      Sua plataforma de transcrição inteligente
    </p>
  </section>
</template>