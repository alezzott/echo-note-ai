import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:4000",
	withCredentials: true,
});

export async function loginWithGoogleToken(idToken: string) {
	const response = await api.post("/auth/google", { idToken });
	return response.data;
}
