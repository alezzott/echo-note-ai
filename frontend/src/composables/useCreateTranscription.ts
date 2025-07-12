import { ref } from "vue";
import axios, { type CancelTokenSource } from "axios";
import { toast } from "vue-sonner";
import { transcribeAudio } from "../api/create-transcription";
import { useLoading } from "./useLoading";
import { useUserStore } from "../stores/user";

export function useCreateTranscription() {
	const userStore = useUserStore();
	const { loading, start, stop } = useLoading();

	const audioFile = ref<File | null>(null);
	const transcript = ref("");
	const error = ref("");
	const progress = ref(0);
	const cancelToken = ref<CancelTokenSource | null>(null);

	async function handleUpload() {
		if (!audioFile.value) return;
		start();
		error.value = "";
		transcript.value = "";
		progress.value = 0;
		cancelToken.value = axios.CancelToken.source();

		try {
			const response = await transcribeAudio({
				audioFile: audioFile.value,
				token: userStore.token ?? "",
				cancelToken: cancelToken.value,
				onUploadProgress: (evt) => {
					if (evt.total) {
						progress.value = Math.round((evt.loaded / evt.total) * 100);
					}
				},
			});
			transcript.value = response.text;
			toast.success("Audio enviado com sucesso !");
		} catch (err: any) {
			if (axios.isCancel(err)) {
				toast.error("Envio cancelado pelo usuário.");
			} else {
				error.value = err?.response?.data?.error || "Erro ao transcrever áudio";
				toast.error("Erro ao enviar áudio, tente novamente");
			}
		} finally {
			stop();
			progress.value = 0;
			cancelToken.value = null;
		}
	}

	function handleFileChange(file: File) {
		audioFile.value = file;
		error.value = "";
	}

	function cancelUpload() {
		if (cancelToken.value) {
			cancelToken.value.cancel("Upload cancelado pelo usuário.");
			audioFile.value = null;
		}
	}

	return {
		loading,
		audioFile,
		transcript,
		error,
		progress,
		handleUpload,
		handleFileChange,
		cancelUpload,
	};
}
