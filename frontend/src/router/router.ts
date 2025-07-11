import {
	createRouter,
	createWebHistory,
	type RouteRecordRaw,
} from "vue-router";
import { useUserStore } from "../stores/user";
import DashboardView from "../views/auth/DashboardView.vue";
import LoginView from "../views/auth/LoginView.vue";

const routes: Array<RouteRecordRaw> = [
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
];

// Guard de navegação para rotas protegidas
function authGuard(to: any, _from: any, next: any) {
	const userStore = useUserStore();
	const isAuth = !!userStore.user;

	// Rotas públicas que não devem ser acessadas por usuários autenticados
	const publicPages = ["/", "/login"];

	if (isAuth && publicPages.includes(to.path)) {
		next("/dashboard");
	}
	// Rota protegida e não autenticado
	else if (to.meta.requiresAuth && !isAuth) {
		next("/login");
	} else {
		next();
	}
}

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach(authGuard);

export default router;
