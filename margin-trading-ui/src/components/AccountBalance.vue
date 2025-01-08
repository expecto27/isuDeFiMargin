<template>
  <div>
    <h2>Account Balance</h2>
    <p>Address: {{ account }}</p>
    <p>ETH Balance: {{ balance }} ETH</p>
  </div>
</template>

<script>
import { ethers } from "ethers";

export default {
  data() {
    return {
      account: "",
      balance: 0,
    };
  },
  methods: {
    async fetchAccountInfo() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      this.account = await signer.getAddress();

      const balance = await provider.getBalance(this.account);
      this.balance = ethers.utils.formatEther(balance);
    },
  },
  mounted() {
    this.fetchAccountInfo();
  },
};
</script>
