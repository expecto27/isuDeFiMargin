<template>
  <div>
    <h2>Trade</h2>

    <!-- Поля для ввода и обмена токенов -->
    <div>
      <label for="tokenToTrade">Выберите токен для обмена:</label>
      <select v-model="tokenToTrade">
        <option :value="wethAddress">WETH</option>
        <option :value="usdcAddress">USDC</option>
        <option :value="wbtcAddress">WBTC</option>
      </select>

      <label for="tokenToReceive">Выберите токен для получения:</label>
      <select v-model="tokenToReceive">
        <option :value="wethAddress">WETH</option>
        <option :value="usdcAddress">USDC</option>
        <option :value="wbtcAddress">WBTC</option>
      </select>

      <input type="number" v-model="tradeAmount" placeholder="Amount to trade" />
      <input type="number" v-model="minAmountOut" placeholder="Min Amount Out" />
      <button @click="trade">Trade</button>
      <p v-if="tradeSuccess">Trade successful!</p>
    </div>

    <!-- Таблица для отображения информации о токенах -->
    <h3>Token Info</h3>
    <div v-if="tokenInfoToTrade">
      <h4>Token to Trade: {{ tokenInfoToTrade.name }}</h4>
      <table>
        <thead>
          <tr>
            <th>Available for Trading</th>
            <th>Deposit Amount</th>
            <th>Borrow Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ tokenInfoToTrade.availableForTrading }} tokens</td>
            <td>{{ tokenInfoToTrade.depositAmount }} tokens</td>
            <td>{{ tokenInfoToTrade.borrowAmount }} tokens</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="tokenInfoToReceive">
      <h4>Token to Receive: {{ tokenInfoToReceive.name }}</h4>
      <table>
        <thead>
          <tr>
            <th>Available for Trading</th>
            <th>Deposit Amount</th>
            <th>Borrow Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ tokenInfoToReceive.availableForTrading }} tokens</td>
            <td>{{ tokenInfoToReceive.depositAmount }} tokens</td>
            <td>{{ tokenInfoToReceive.borrowAmount }} tokens</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { ethers } from "ethers";
import { contractAddress, contractAbi } from "@/contract-config";

export default {
  name: "TradeUniswap",
  data() {
    return {
      wethAddress: "0x8b9be2CF5d272De98202DEBd74b0f9148E863bA9", // Пример адреса WETH
      usdcAddress: "0xF629BFc5d5A06cae5AF5ee178e99538e5616e49B", // Пример адреса USDC
      wbtcAddress: "0x95749A89baBcD0bD16BeeCeE3A93811EC013AcB3", // Пример адреса WBTC
      tokenToTrade: "", // Токен для обмена
      tokenToReceive: "", // Токен для получения
      tradeAmount: 0,
      minAmountOut: 0,
      tradeSuccess: false,
      tokenInfoToTrade: null, // Информация о токене для обмена
      tokenInfoToReceive: null, // Информация о токене для получения
    };
  },
  methods: {
    async fetchTokenInfo(tokenAddress) {
      const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545");
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);

      try {
        const position = await contract.getPosition(await signer.getAddress(), tokenAddress);

        const tokenInfo = {
          name: tokenAddress === this.wethAddress ? "WETH" : tokenAddress === this.usdcAddress ? "USDC" : "WBTC",
          availableForTrading: ethers.utils.formatEther(position.collateral),
          depositAmount: ethers.utils.formatEther(position.collateral),
          borrowAmount: ethers.utils.formatEther(position.debt),
        };

        if (tokenAddress === this.tokenToTrade) {
          this.tokenInfoToTrade = tokenInfo;
        } else if (tokenAddress === this.tokenToReceive) {
          this.tokenInfoToReceive = tokenInfo;
        }
      } catch (error) {
        console.error("Error fetching token info:", error);
      }
    },

    async trade() {
      const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545");
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractAbi, signer);

      const amountIn = ethers.utils.parseEther(this.tradeAmount.toString());
      const amountOutMin = ethers.utils.parseEther(this.minAmountOut.toString());

      const path = [this.tokenToTrade, this.tokenToReceive];

      try {
        // Выполнение транзакции с установленным лимитом газа
        const tx = await contract.trade(amountIn, amountOutMin, path, { gasLimit: 1000000 });

        // Ожидание завершения транзакции
        await tx.wait();

        this.tradeSuccess = true;
        alert("Trade successful!");
      } catch (error) {
        console.error("Trade error:", error);
        this.tradeSuccess = false;
        alert("Trade failed!");
      }
    },
  },
  watch: {
    tokenToTrade(newAddress) {
      this.fetchTokenInfo(newAddress); // Получаем информацию для токена, с которым будет производиться обмен
    },
    tokenToReceive(newAddress) {
      this.fetchTokenInfo(newAddress); // Получаем информацию для токена, который будет получен
    },
  },
  mounted() {
    this.tokenToTrade = this.wethAddress; // Устанавливаем начальный токен для обмена (например, WETH)
    this.tokenToReceive = this.usdcAddress; // Устанавливаем начальный токен для получения (например, USDC)
    this.fetchTokenInfo(this.tokenToTrade); // Загружаем информацию для начального токена
    this.fetchTokenInfo(this.tokenToReceive); // Загружаем информацию для начального токена для получения
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
}
</style>
