import { createRouter, createWebHistory } from "vue-router";
import Deposit from "./components/Deposit.vue";
import Borrow from "./components/Borrow.vue";
import Trade from "./components/Trade.vue";
import Liquidation from "./components/Liquidation.vue";
import AccountBalance from "./components/AccountBalance.vue";

const routes = [
    { path: "/", redirect: "/account" }, // Домашняя страница
    { path: "/deposit", component: Deposit },
    { path: "/borrow", component: Borrow },
    { path: "/trade", component: Trade },
    { path: "/liquidation", component: Liquidation },
    { path: "/account", component: AccountBalance },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
