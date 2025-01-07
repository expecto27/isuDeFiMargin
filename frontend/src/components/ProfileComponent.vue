<template>
  <div>
    <h1>Profile</h1>

    <div v-if="userAddress">
      <p>Ваш адрес: {{ userAddress }}</p>
    </div>

    <button v-if="!userAddress" @click="connectWallet">Подключить кошелек</button>
  </div>
</template>

<script>
import { ethers } from 'ethers';

export default {
  data() {
    return {
      userAddress: null,
      provider: null,
      signer: null,
      balance: null,
      connected: false,
    };
  },
  created() {
    this.checkWalletConnection();
  },
  methods: {
    async checkWalletConnection() {
      const isAuthorized = JSON.parse(localStorage.getItem('isAuthorized'));
      const storedAddress = localStorage.getItem('userAddress');
      if (isAuthorized && storedAddress) {
        try {
          if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.includes(storedAddress)) {
              this.userAddress = storedAddress;
              this.connected = true;

              this.provider = new ethers.providers.Web3Provider(window.ethereum);
              this.signer = this.provider.getSigner();
            } else {
              this.disconnectWallet();
            }
          }
        } catch (error) {
          console.error('Ошибка при проверке подключения:', error);
        }
      }
    },

    async connectWallet() {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const userAddress = accounts[0];

          // Сохраняем адрес кошелька и статус авторизации
          this.userAddress = userAddress;
          this.connected = true;
          localStorage.setItem('isAuthorized', JSON.stringify(true));
          localStorage.setItem('userAddress', userAddress);

          // Инициализируем провайдер и signer
          this.provider = new ethers.providers.Web3Provider(window.ethereum);
          this.signer = this.provider.getSigner();
        } catch (error) {
          console.error('Ошибка при подключении:', error);
        }
      } else {
        alert('Пожалуйста, установите MetaMask!');
      }
    },

    disconnectWallet() {
      // Удаляем данные из localStorage и сбрасываем состояние
      localStorage.removeItem('isAuthorized');
      localStorage.removeItem('userAddress');
      this.userAddress = null;
      this.balance = null;
      this.connected = false;
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
</style>
