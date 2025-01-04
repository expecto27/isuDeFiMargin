import { createWebHistory, createRouter } from "vue-router";
import MarginComponent from "./components/MarginComponent.vue";
import MainComponent from "./components/MainComponent.vue";

const routes = [
    {
        path: "/margin",
        name: "margin", 
        alias: "/margin",
        component: MarginComponent,
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