import axios from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
});

export async function loginWithGoogleToken(idToken: string) {
	const response = await api.post("/auth/google", { idToken });
	return response.data;
}
