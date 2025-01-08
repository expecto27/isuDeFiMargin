<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <h2>Deposit Funds</h2>
    <input type="number" v-model="amount" placeholder="Enter amount" />
    <button @click="deposit">Deposit</button>
    <p>Your current deposit: {{ userDeposit }} ETH</p>
  </div>
</template>

<script>
import { ethers } from "ethers";
import { contractAddress, contractAbi } from "@/contract-config";

export default {
  data() {
    return {
      amount: 0,
      userDeposit: 0,
    };
  },
  methods: {
    async deposit() {
      try {
        if (!window.ethereum) throw new Error("MetaMask не установлен");

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractAbi, signer);

        console.log(contract);

        // Убедитесь, что у пользователя есть достаточно токенов и разрешение на перевод
        const collateralTokenAddress = await contract.collateralToken();
        const collateralToken = new ethers.Contract(
          collateralTokenAddress,
          ["function approve(address spender, uint256 amount) public returns (bool)"],
          signer
        );

        console.log(collateralToken);

        // Одобряем контракту перевод токенов
        const approveTx = await collateralToken.approve(
          contractAddress,
          ethers.utils.parseEther(this.amount.toString())
        );
        await approveTx.wait();

        console.log(approveTx);

        // Выполняем депозит
        const depositTx = await contract.deposit(
          ethers.utils.parseEther(this.amount.toString())
        );
        await depositTx.wait();

        alert("Депозит успешно выполнен");
        this.fetchUserDeposit();
      } catch (error) {
        console.error(error);
        alert("Ошибка при депозите");
      }
    },
    // async deposit() {
    //   const provider = new ethers.providers.Web3Provider(window.ethereum);
    //   await provider.send("eth_requestAccounts", []);
    //   const signer = provider.getSigner();
    //   const contract = new ethers.Contract(contractAddress, contractAbi, signer);

    //   const amount = ethers.utils.parseEther(this.depositAmount.toString());
    //   await contract.deposit(amount);
    //   alert("Deposit successful!");
    // },
    async fetchUserDeposit() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);

      const address = await signer.getAddress();
      this.userDeposit = ethers.utils.formatEther(await contract.deposits(address));
    },
  },
  mounted() {
    this.fetchUserDeposit();
  },
};
</script>
