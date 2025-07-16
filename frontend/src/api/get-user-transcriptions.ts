import axios from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	withCredentials: true,
});

export async function getTranscriptions(params: {
	userId: string;
	page?: number;
	limit?: number;
	sortBy?: string;
	order?: "asc" | "desc";
	token: string;
}) {
	const {
		userId,
		page,
		limit,
		sortBy = "createdAt",
		order = "asc",
		token,
	} = params;

	const response = await api.get("/transcriptions", {
		params: { userId, page, limit, sortBy, order },
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
}
