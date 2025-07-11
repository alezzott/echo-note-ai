import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { isTokenExpired } from "../helpers/expires-token";
import { useUserStore } from "../stores/user";

const publicPages = ["/", "/login"];

export function authGuard(
	to: RouteLocationNormalized,
	_from: RouteLocationNormalized,
	next: NavigationGuardNext,
): void {
	const userStore = useUserStore();
	const isAuth =
		!!userStore.user && !!userStore.token && !isTokenExpired(userStore.token);

	if (isAuth && publicPages.includes(to.path)) {
		next("/dashboard");
	} else if (to.meta.requiresAuth && !isAuth) {
		userStore.clearUser();
		next("/login");
	} else {
		next();
	}
}
