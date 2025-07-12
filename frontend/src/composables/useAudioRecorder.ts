import { ref } from "vue";

export function useAudioRecorder(
	emit: (e: "audioRecorded", file: File) => void,
) {
	const isRecording = ref(false);
	const mediaRecorder = ref<MediaRecorder | null>(null);
	const recordedChunks = ref<Blob[]>([]);
	const error = ref("");
	const duration = ref(0);
	let timer: number | null = null;
	let stream: MediaStream | null = null;

	async function handleRecord() {
		if (!isRecording.value) {
			recordedChunks.value = [];
			try {
				stream = await navigator.mediaDevices.getUserMedia({ audio: true });
				mediaRecorder.value = new MediaRecorder(stream);
				mediaRecorder.value.ondataavailable = (e) => {
					if (e.data.size > 0) recordedChunks.value.push(e.data);
				};
				mediaRecorder.value.onstop = () => {
					const audioBlob = new Blob(recordedChunks.value, {
						type: "audio/webm",
					});
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
			if (stream) {
				stream.getTracks().forEach((track) => track.stop());
				stream = null;
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
		if (stream) {
			stream.getTracks().forEach((track) => track.stop());
			stream = null;
		}
	}

	return {
		isRecording,
		mediaRecorder,
		recordedChunks,
		error,
		duration,
		handleRecord,
		handleStop,
	};
}
