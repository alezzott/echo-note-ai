import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { isTokenExpired } from "../helpers/expires-token";
import { useUserStore } from "../stores/user";

const publicPages = ["/login"];

export function authGuard(
	to: RouteLocationNormalized,
	_from: RouteLocationNormalized,
	next: NavigationGuardNext,
): void {
	const userStore = useUserStore();
	const isAuth =
		!!userStore.user && !!userStore.token && !isTokenExpired(userStore.token);

	if (!isAuth && !publicPages.includes(to.path)) {
		userStore.clearUser();
		next("/login");
	}
	// Se está autenticado e acessa /login, redireciona para dashboard
	else if (isAuth && to.path === "/login") {
		next("/dashboard");
	} else {
		next();
	}
}
