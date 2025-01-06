import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import UniswapVue from 'uniswap-vue';
const app = createApp(App);
app.use(router); 
app.use(UniswapVue);
app.mount('#app')
