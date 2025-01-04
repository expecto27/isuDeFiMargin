import { createWebHistory, createRouter } from "vue-router";
import TokenSwap from "./components/TokenSwap.vue";
import MainComponent from "./components/MainComponent.vue";

const routes = [
    {
        path: "/swap",
        name: "TokenSwap", 
        alias: "/tokenswap",
        component: TokenSwap,
        meta: {
            title: "Margin"
        }
    },
    {
        path: "/main",
        name: "main", 
        alias: "/main",
        component: MainComponent,
        meta: {
            title: "Main"
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes, 
});

router.beforeEach((to, from, next) => {
    document.title = to.meta.title || 'Главная страница';
    next();
});

export default router;