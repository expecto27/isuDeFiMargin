<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div>
      <h2>Liquidation</h2>
      <p>Check liquidation status</p>
      <p>Status: {{ liquidationStatus }}</p>
      <button @click="checkLiquidation">Check</button>
    </div>
  </template>
  
  <script>
  import { ethers } from "ethers";
  import { contractAddress, contractAbi } from "@/contract-config";
  export default {
    data() {
      return {
        liquidationStatus: "Unknown",
      };
    },
    methods: {
      async checkLiquidation() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractAbi, signer);
  
        const address = await signer.getAddress();
        const isLiquidatable = await contract.isLiquidatable(address);
        this.liquidationStatus = isLiquidatable ? "Liquidatable" : "Safe";
      },
    },
  };
  </script>
  