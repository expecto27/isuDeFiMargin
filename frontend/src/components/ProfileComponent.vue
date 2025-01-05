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
      if (isAuthorized) {
        // If the user is authorized, check for the current address and balance
        try {
          if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (accounts.length > 0) {
              this.userAddress = accounts[0];
              this.connected = true;

              this.provider = new ethers.providers.Web3Provider(window.ethereum);
              this.signer = this.provider.getSigner();

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
          // Request the user's accounts
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          this.userAddress = accounts[0]; // Get the first account
          this.connected = true; // Mark wallet as connected

          // Save the authorization state in localStorage
          localStorage.setItem('isAuthorized', JSON.stringify(true));

          // Initialize provider and signer
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
      // Remove the authorization flag and reset state
      localStorage.removeItem('isAuthorized');
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
