import { reactive, toRefs } from "vue";

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function useAudioRecorder(
  emit: (e: "audioRecorded", file: File) => void,
) {
  const state = reactive({
    isRecording: false,
    mediaRecorder: null as MediaRecorder | null,
    recordedChunks: [] as Blob[],
    error: "",
    duration: 0,
  });

  let timer: number | null = null;
  let stream: MediaStream | null = null;

  async function handleRecord() {
    if (!state.isRecording) {
      state.recordedChunks = [];
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        state.mediaRecorder = new MediaRecorder(stream);
        state.mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) state.recordedChunks.push(e.data);
        };
        state.mediaRecorder.onstop = () => {
          const audioBlob = new Blob(state.recordedChunks, {
            type: "audio/webm",
          });
          const now = new Date();
          const fileName = `gravacao-${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()}_${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}.webm`;
          const file = new File([audioBlob], fileName, { type: "audio/webm" });
          emit("audioRecorded", file);
          state.duration = 0;
        };
        state.mediaRecorder.start();
        state.isRecording = true;
        state.duration = 0;
        timer = window.setInterval(() => {
          state.duration += 1;
        }, 1000);
      } catch (err) {
        state.error = "Não foi possível acessar o microfone.";
      }
    } else {
      state.mediaRecorder?.stop();
      state.isRecording = false;
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        stream = null;
      }
    }
  }

  function handleStop() {
    state.mediaRecorder?.stop();
    state.isRecording = false;
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
    }
  }

  return {
    ...toRefs(state),
    handleRecord,
    handleStop,
  };
}
