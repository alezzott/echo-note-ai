import type { AuthUser } from "@/composables/useAuth";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
	state: () => ({
		user: JSON.parse(localStorage.getItem("user") || "null") as null | {
			uid: string;
			name: string;
			email: string;
			photoURL?: string;
		},
		token: localStorage.getItem("token") as null | string,
	}),
	actions: {
		setUser(user: AuthUser, token: string) {
			this.user = user;
			this.token = token;
			localStorage.setItem("user", JSON.stringify(user));
			localStorage.setItem("token", token);
		},
		clearUser() {
			this.user = null;
			this.token = null;
			localStorage.removeItem("user");
			localStorage.removeItem("token");
		},
	},
});
