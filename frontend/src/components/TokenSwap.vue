<template>
  <div>
    <h1>Uniswap Trade</h1>
    <form @submit.prevent="swap">
      <label for="fromToken">Из:</label>
      <select v-model="fromToken">
        <option value="WETH">WETH</option>
        <option value="WBTC">WBTC</option>
        <option value="USDC">USDC</option>
      </select>

      <label for="toToken">В:</label>
      <select v-model="toToken">
        <option value="WETH">WETH</option>
        <option value="WBTC">WBTC</option>
        <option value="USDC">USDC</option>
      </select>

      <label for="amount">Сумма:</label>
      <input type="number" v-model="amount" />

      <button @click="swap">Обменять</button>
    </form>

    <div v-if="userAddress">
      <p>Ваш адрес: {{ userAddress }}</p>
    </div>

    <div v-else>
      <button @click="connectWallet">Подключить кошелек</button>
    </div>

    <!-- Add this section to show the address or button at the bottom of the page -->
    <div class="footer">
      <p v-if="userAddress">Ваш адрес: {{ userAddress }}</p>
      <p v-else>Пожалуйста, подключите ваш кошелек для продолжения.</p>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers';

export default {
  data() {
    return {
      fromToken: 'WETH',
      toToken: 'USDC',
      amount: 0,
      userAddress: null,
      provider: null,
      signer: null,
      connected: false,
      contractResult: ''
    };
  },
  created() {
    // Check if the user is already authorized from localStorage
    const isAuthorized = JSON.parse(localStorage.getItem('isAuthorized'));
    if (isAuthorized) {
      this.connectWallet(true); // If authorized, connect the wallet and get the address/balance
    }
  },
  methods: {
    async connectWallet(fromLocalStorage = false) {
      if (window.ethereum) { // first we check if metamask is installed
        try {
          if (!fromLocalStorage) {
            // Request the user's accounts only if not from localStorage
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.userAddress = accounts[0]; // Get the first account
            this.connected = true; // Mark wallet as connected

            // Save the authorization state in localStorage
            localStorage.setItem('isAuthorized', true);
          } else {
            // If user is authorized, get the address and balance
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            this.userAddress = accounts[0]; // Get the first account
          }

          // Initialize provider and signer
          this.provider = new ethers.providers.Web3Provider(window.ethereum);
          this.signer = this.provider.getSigner();

          // Get balance and display it
          const balanceWei = await this.provider.getBalance(this.userAddress);
          this.balance = ethers.utils.formatEther(balanceWei);
        } catch (error) {
          console.error('Ошибка при подключении:', error);
        }
      } else {
        alert('Пожалуйста, установите MetaMask!');
      }
    },

    async swap() {
      if (!this.userAddress) {
        alert('Пожалуйста, подключите ваш кошелек!');
        return;
      }

      try {
        // Передаем signer в функцию swapTokens
        const tx = await swapTokens(this.amount, this.fromToken, this.toToken, this.userAddress, this.signer);
        console.log('Transaction:', tx);
      } catch (error) {
        console.error('Ошибка:', error.message);
      }
    }
  }
};
</script>

<style>
.component {
  font-family: 'JetBrains Mono', Avenir, Helvetica, Arial, sans-serif;
  background-color: #2b2b2b;
  color: #e1e1e1;
  min-height: 100%;
}

.footer {
  position: fixed;
  bottom: 20px;
  width: 100%;
  text-align: center;
  color: #e1e1e1;
}

button {
  margin-top: 20px;
}
</style>
