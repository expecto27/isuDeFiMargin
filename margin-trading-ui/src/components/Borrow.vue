<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <h2>Borrow Funds</h2>
    <input type="number" v-model="amount" placeholder="Enter amount" />
    <button @click="borrow">Borrow</button>
    <p>Your current borrow amount: {{ userBorrow }} ETH</p>
  </div>
</template>

<script>
import { ethers } from "ethers";
import { contractAddress, contractAbi } from "@/contract-config";

export default {
  data() {
    return {
      amount: 0,
      userBorrow: 0,
    };
  },
  methods: {
    async borrow() {
      try {
        if (!window.ethereum) throw new Error("MetaMask не установлен");

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractAbi, signer);

        // Выполняем займ
        const borrowTx = await contract.borrow(ethers.utils.parseEther(this.amount.toString()));
        await borrowTx.wait();

        alert("Займ успешно выполнен");
        this.fetchUserBorrow();
      } catch (error) {
        console.error(error);
        alert("Ошибка при займе");
      }
    },
    // async borrow() {
    //   const provider = new ethers.providers.Web3Provider(window.ethereum);
    //   const signer = provider.getSigner();
    //   const contract = new ethers.Contract(contractAddress, contractAbi, signer);

    //   const amount = ethers.utils.parseEther(this.borrowAmount.toString());
    //   await contract.borrow(amount);
    //   alert("Borrow successful!");
    //   this.fetchUserBorrow();
    // },
    async fetchUserBorrow() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);

      const address = await signer.getAddress();
      this.userBorrow = ethers.utils.formatEther(await contract.borrowAmounts(address));
    },
  },
  mounted() {
    this.fetchUserBorrow();
  },
};
</script>
