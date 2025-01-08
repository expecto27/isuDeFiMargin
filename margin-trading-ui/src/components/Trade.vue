<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <h2>Trade</h2>
    <input type="text" v-model="tokenToBuy" placeholder="Token to buy (e.g., WETH)" />
    <input type="number" v-model="tradeAmount" placeholder="Amount to trade" />
    <button @click="trade">Trade</button>
    <p>Trade successful!</p>
  </div>
</template>

<script>
import { ethers } from "ethers";
import { contractAddress, contractAbi } from "@/contract-config";

export default {
  data() {
    return {
      tokenToBuy: "",
      tradeAmount: 0,
    };
  },
  methods: {
    async trade() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);

      // Пример вызова торговой функции
      const amount = ethers.utils.parseEther(this.tradeAmount.toString());
      await contract.trade(this.tokenToBuy, amount);
      alert("Trade successful!");
    },
  },
};
</script>
