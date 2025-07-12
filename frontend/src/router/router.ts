import {
	createRouter,
	createWebHistory,
	type RouteRecordRaw,
} from "vue-router";
import { useUserStore } from "../stores/user";
import DashboardView from "../views/auth/DashboardView.vue";
import LoginView from "../views/auth/LoginView.vue";
import { authGuard } from "./authGuard";
import { isTokenExpired } from "../helpers/expires-token";

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		redirect: "/login",
	},
	{
		path: "/login",
		component: LoginView,
		name: "Login",
	},
	{
		path: "/dashboard",
		component: DashboardView,
		name: "Dashboard",
		meta: { requiresAuth: true },
	},
	{
		path: "/:catchAll(.*)",
		redirect: () => {
			const userStore = useUserStore();
			const isAuth =
				!!userStore.user &&
				!!userStore.token &&
				!isTokenExpired(userStore.token);
			return isAuth ? "/dashboard" : "/login";
		},
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach(authGuard);

export default router;
