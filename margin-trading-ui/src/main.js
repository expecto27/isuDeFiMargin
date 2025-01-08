import { createApp } from 'vue'
import App from './App.vue'
import { ethers } from "ethers";
import router from "./router";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

createApp(App).use(router).mount("#app");

export { provider, signer };
