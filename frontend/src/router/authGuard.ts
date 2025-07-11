import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { useUserStore } from "../stores/user";

const publicPages = ["/", "/login"];

export function authGuard(
	to: RouteLocationNormalized,
	_from: RouteLocationNormalized,
	next: NavigationGuardNext,
): void {
	const userStore = useUserStore();
	const isAuth = !!userStore.user;

	if (isAuth && publicPages.includes(to.path)) {
		next("/dashboard");
	} else if (to.meta.requiresAuth && !isAuth) {
		next("/login");
	} else {
		next();
	}
}
