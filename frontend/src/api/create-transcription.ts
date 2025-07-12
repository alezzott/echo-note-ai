import axios, { type AxiosProgressEvent, type CancelTokenSource } from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
});

export async function transcribeAudio({
	audioFile,
	token,
	cancelToken,
	onUploadProgress,
}: {
	audioFile: File;
	token: string;
	cancelToken?: CancelTokenSource;
	onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
}) {
	const formData = new FormData();
	formData.append("audio", audioFile);

	const response = await api.post("/transcribe", formData, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
		onUploadProgress,
		cancelToken: cancelToken?.token,
	});

	return response.data;
}
