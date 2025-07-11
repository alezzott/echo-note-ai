import {
	GoogleAuthProvider,
	signInWithPopup,
	type UserCredential,
} from "firebase/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { loginWithGoogleToken } from "../api/auth-api";
import { auth } from "../config/firebase.config";
import { useUserStore } from "../stores/user";

type AuthUser = {
	uid?: string;
	name: string;
	email: string;
	photoURL?: string;
};

function getAuthErrorMessage(
	code: string | undefined,
	fallback: string,
): string {
	const messages: Record<string, string> = {
		"auth/popup-closed-by-user":
			"O pop-up de login foi cancelado. Tente novamente.",
		"auth/network-request-failed": "Falha de conexão. Verifique sua internet.",
	};
	return code && messages[code] ? messages[code] : fallback;
}

function mapUser(userData: any): AuthUser {
	return {
		uid: userData.uid,
		name: userData.name,
		email: userData.email,
		photoURL: userData.picture,
	};
}

export function useAuth() {
	const loading = ref(false);
	const error = ref<string | null>(null);
	const userStore = useUserStore();
	const router = useRouter();

	async function loginWithGoogle(): Promise<void> {
		loading.value = true;
		error.value = null;
		try {
			const provider = new GoogleAuthProvider();
			const result: UserCredential = await signInWithPopup(auth, provider);
			const idToken: string = await result.user.getIdToken();

			const userData = await loginWithGoogleToken(idToken);
			const user = mapUser(userData);
			userStore.setUser(user, idToken);

			toast.success("Login realizado com sucesso!");
			router.push("/dashboard");
		} catch (e: any) {
			error.value = getAuthErrorMessage(
				e?.code,
				e?.message || "Erro ao autenticar com Google",
			);
			toast.error(`Erro ao autenticar: ${error.value}`);
		} finally {
			loading.value = false;
		}
	}

	function logout(): void {
		userStore.clearUser();
		toast.success("Logout realizado!");
	}

	return { loginWithGoogle, logout, loading, error };
}
