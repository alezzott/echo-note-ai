import axios from "axios";

const api = axios.create({
	baseURL: "http://localhost:4000",
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
		page = 1,
		limit = 10,
		sortBy = "createdAt",
		order = "asc",
		token,
	} = params;

	console.log("userId enviado para API:", userId);

	const response = await api.get("/transcriptions", {
		params: { userId, page, limit, sortBy, order },
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	return response.data;
}
