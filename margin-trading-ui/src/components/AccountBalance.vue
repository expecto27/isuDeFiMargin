<template>
  <div>
    <h2>Account Balance</h2>
    <p>Address: {{ account }}</p>
    <p>ETH Balance: {{ balance }} ETH</p>
    <p>USDC Balance: {{ balanceUSDC }} USDC</p>
    <p>WETH Balance: {{ balanceWETH }} WETH</p>
    <p>WBTC Balance: {{ balanceWBTC }} WBTC</p>
  </div>
</template>

<script>
import { ethers } from "ethers";
import { tokenAbi } from "@/contract-config.js"
export default {
  data() {
    return {
      account: "",
      balance: 0,
      balanceUSDC: 0,
      balanceWETH: 0,
      balanceWBTC: 0
    };
  },
  methods: {
    async fetchAccountInfo() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      this.account = await signer.getAddress();

      const balance = await provider.getBalance(this.account);
      this.balance = ethers.utils.formatEther(balance);
      console.log(balance.toString());
    },
    async fetchTokenBalance() {
      const WETHaddress = '0x8b9be2CF5d272De98202DEBd74b0f9148E863bA9';
      const USDCaddress = '0xF629BFc5d5A06cae5AF5ee178e99538e5616e49B';
      const WBTCaddress = '0x95749A89baBcD0bD16BeeCeE3A93811EC013AcB3';
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      
      // Создаем экземпляр контракта токена
      const tokenContractUSDC = new ethers.Contract(USDCaddress, tokenAbi, provider);
      const tokenContractWETH = new ethers.Contract(WETHaddress, tokenAbi, provider);
      const tokenContractWBTC = new ethers.Contract(WBTCaddress, tokenAbi, provider);

      // Получаем баланс и количество десятичных знаков
      var balanceUSDC = await tokenContractUSDC.balanceOf(account);
      var decimalsUSDC = await tokenContractUSDC.decimals();

      var balanceWETH = await tokenContractWETH.balanceOf(account);
      var decimalsWETH = await tokenContractWETH.decimals();

      var balanceWBTC = await tokenContractWBTC.balanceOf(account);
      var decimalsWBTC = await tokenContractWBTC.decimals();

      // Форматируем баланс
      const formattedBalanceUSDC = ethers.utils.formatUnits(balanceUSDC, decimalsUSDC);
      const formattedBalanceWETH = ethers.utils.formatUnits(balanceWETH, decimalsWETH);
      const formattedBalanceWBTC = ethers.utils.formatUnits(balanceWBTC, decimalsWBTC);

      this.balanceUSDC = formattedBalanceUSDC;
      this.balanceWETH = formattedBalanceWETH;
      this.balanceWBTC = formattedBalanceWBTC;
    }
  },
  mounted() {
    this.fetchAccountInfo();
    this.fetchTokenBalance();
  },
};
</script>
