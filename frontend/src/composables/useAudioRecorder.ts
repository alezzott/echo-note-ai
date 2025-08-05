import { computed, reactive, toRefs } from 'vue';
import { toast } from 'vue-sonner';

type AudioRecorderEmit = {
  (e: 'audioRecorded', file: File): void;
  (e: 'cancelUpload'): void;
};

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

function formatDuration(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${pad(min)}:${pad(sec)}`;
}

function createFileFromBlob(blob: Blob): File {
  const now = new Date();
  const fileName = `gravacao-${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}_${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.webm`;
  return new File([blob], fileName, { type: 'audio/webm' });
}

export function useAudioRecorder(emit: AudioRecorderEmit) {
  const state = reactive({
    isRecording: false,
    mediaRecorder: null as MediaRecorder | null,
    recordedChunks: [] as Blob[],
    error: '',
    duration: 0,
  });

  const formattedDuration = computed(() => formatDuration(state.duration));
  let timer: number | null = null;
  let stream: MediaStream | null = null;
  let isCancelled = false;

  async function handleRecord(): Promise<void> {
    if (state.isRecording) {
      stopRecording();
      return;
    }
    state.recordedChunks = [];
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      state.mediaRecorder = new MediaRecorder(stream);

      state.mediaRecorder.ondataavailable = handleDataAvailable;
      state.mediaRecorder.onstop = handleStopRecording;

      state.mediaRecorder.start();
      state.isRecording = true;
      state.duration = 0;
      timer = window.setInterval(() => {
        state.duration += 1;
      }, 1000);
    } catch {
      state.error = 'Não foi possível acessar o microfone.';
    }
  }

  function handleDataAvailable(e: BlobEvent): void {
    if (e.data.size > 0) state.recordedChunks.push(e.data);
  }

  function handleStopRecording(): void {
    if (isCancelled) {
      isCancelled = false;
      state.duration = 0;
      return;
    }
    const audioBlob = new Blob(state.recordedChunks, { type: 'audio/webm' });
    const file = createFileFromBlob(audioBlob);
    emit('audioRecorded', file);
    state.duration = 0;
  }

  function stopRecording(): void {
    state.mediaRecorder?.stop();
    state.isRecording = false;
    clearTimer();
    stopStream();
  }

  function handleStop(): void {
    stopRecording();
  }

  function handleCancel(): void {
    if (state.isRecording) {
      isCancelled = true;
      stopRecording();
      state.recordedChunks = [];
      state.duration = 0;
      state.error = '';
      emit('cancelUpload');
      toast.error('áudio cancelado');
    }
  }

  function clearTimer(): void {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function stopStream(): void {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
    }
  }

  return {
    ...toRefs(state),
    formattedDuration,
    handleRecord,
    handleStop,
    handleCancel,
  };
}
