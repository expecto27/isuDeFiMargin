<template>
  <div>
    <h2>Депозит и Заем в MarginTrading</h2>

    <div v-if="myComponent">
      <!-- Выбор токена для депозита -->
      <div>
        <label for="tokenSelect">Выберите токен:</label>
        <select v-model="tokenAddress">
          <option :value="wethAddress">WETH</option>
          <option :value="usdcAddress">USDC</option>
          <option :value="wbtcAddress">WBTC</option>
        </select>
      </div>

      <!-- Депозит -->
      <div>
        <label for="amount">Сумма для депозита (в токенах):</label>
        <input type="number" v-model="amount" placeholder="Введите сумму для депозита" />
      </div>
      <button @click="depositTokens">Внести депозит</button>

      <div v-if="depositSuccess !== null">
        <p v-if="depositSuccess">Депозит успешно внесен!</p>
        <p v-else>Произошла ошибка при внесении депозита.</p>
      </div>

      <!-- Займ -->
      <h3>Заемный капитал</h3>
      <div>
        <label for="borrowAmount">Сумма займа (в токенах):</label>
        <input type="number" v-model="borrowAmount" placeholder="Введите сумму для займа" />
      </div>
      <button @click="borrowTokens">Взять заем</button>

      <div v-if="borrowSuccess !== null">
        <p v-if="borrowSuccess">Заем успешно получен!</p>
        <p v-else>Произошла ошибка при получении займа.</p>
      </div>

      <!-- Информация о токенах -->
      <h3>Информация о средствах</h3>
      <table>
        <thead>
          <tr>
            <th>Токен</th>
            <th>Доступно для торговли</th>
            <th>Депозит</th>
            <th>Заемные средства</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(token, address) in tokenInfo" :key="address">
            <td>{{ token.name }} ({{ address }})</td>
            <td>{{ token.availableForTrading }} токенов</td>
            <td>{{ token.depositAmount }} токенов</td>
            <td>{{ token.borrowAmount }} токенов</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import Web3 from "web3";
import { contractAddress, tokenAbi, contractAbi } from "@/contract-config"; // Путь к ABI вашего контракта

export default {
  name: "DepositAndBorrow",
  data() {
    return {
      myComponent: null,
      web3: null,
      accounts: [],
      marginTrading: null,
      // Адреса токенов
      wethAddress: "0x8b9be2CF5d272De98202DEBd74b0f9148E863bA9",
      usdcAddress: "0xF629BFc5d5A06cae5AF5ee178e99538e5616e49B",
      wbtcAddress: "0x95749A89baBcD0bD16BeeCeE3A93811EC013AcB3",
      tokenAddress: "0x8b9be2CF5d272De98202DEBd74b0f9148E863bA9", // Изначально WETH
      amount: 0,
      borrowAmount: 0,
      isProcessing: false,
      depositSuccess: null,
      borrowSuccess: null,
      tokenInfo: {
        [this.wethAddress]: { name: "WETH", availableForTrading: 0, depositAmount: 0, borrowAmount: 0 },
        [this.usdcAddress]: { name: "USDC", availableForTrading: 0, depositAmount: 0, borrowAmount: 0 },
        [this.wbtcAddress]: { name: "WBTC", availableForTrading: 0, depositAmount: 0, borrowAmount: 0 }
      }
    };
  },
  methods: {
    async depositTokens() {
      this.isProcessing = true;
      try {
        const tokenContract = new this.web3.eth.Contract(tokenAbi, this.tokenAddress);

        // Преобразуем сумму в формат "wei"
        const amountInWei = this.web3.utils.toWei(this.amount.toString(), "ether");

        // Выполняем approve для токена
        await tokenContract.methods
          .approve(this.marginTrading.options.address, amountInWei)
          .send({ from: this.accounts[0] });

        // Вносим депозит
        await this.marginTrading.methods
          .deposit(amountInWei, this.tokenAddress)
          .send({ from: this.accounts[0] });

        this.depositSuccess = true;

        // Обновляем данные для соответствующего токена
        this.updateTokenInfo();
      } catch (error) {
        console.error("Ошибка депозита:", error);
        this.depositSuccess = false;
      } finally {
        this.isProcessing = false;
      }
    },

    async borrowTokens() {
      this.isProcessing = true;
      try {
        const tokenContract = new this.web3.eth.Contract(tokenAbi, this.tokenAddress);

        // Преобразуем сумму в формат "wei"
        const borrowAmountInWei = this.web3.utils.toWei(this.borrowAmount.toString(), "ether");

        // Выполняем approve для займа
        await tokenContract.methods
          .approve(this.marginTrading.options.address, borrowAmountInWei)
          .send({ from: this.accounts[0] });

        // Получаем заем
        await this.marginTrading.methods
          .borrow(borrowAmountInWei, this.tokenAddress)
          .send({ from: this.accounts[0] });

        this.borrowSuccess = true;

        // Обновляем данные для соответствующего токена
        this.updateTokenInfo();
      } catch (error) {
        console.error("Ошибка при получении займа:", error);
        this.borrowSuccess = false;
      } finally {
        this.isProcessing = false;
      }
    },

    async updateTokenInfo() {
      try {
        console.log("Обновление информации о средствах...");

        const addresses = [this.wethAddress, this.usdcAddress, this.wbtcAddress];
        
        for (const address of addresses) {
          if (!this.tokenInfo[address]) {
            this.tokenInfo[address] = { name: "Unknown", availableForTrading: 0, depositAmount: 0, borrowAmount: 0 };
          }
          
          // Получаем позицию для конкретного токена
          const position = await this.marginTrading.methods.getPosition(this.accounts[0], address).call();
          
          // Логируем для проверки, какие данные возвращаются
          console.log(`Position for ${address}:`, position);

          // Обновляем значения для конкретного токена
          this.tokenInfo[address].availableForTrading = this.web3.utils.fromWei(position.collateral, "ether");
          this.tokenInfo[address].depositAmount = this.web3.utils.fromWei(position.collateral, "ether");  // Убедитесь, что это верный параметр для депозита
          this.tokenInfo[address].borrowAmount = this.web3.utils.fromWei(position.debt, "ether");
        }
      } catch (error) {
        console.error("Ошибка при получении информации о средствах:", error);
      }
    },

    async initWeb3() {
      if (window.ethereum) {
        this.web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        this.accounts = await this.web3.eth.getAccounts();

        // Инициализация контракта MarginTrading
        const marginTradingAddress = contractAddress; // Адрес развернутого контракта
        this.marginTrading = new this.web3.eth.Contract(contractAbi, marginTradingAddress);

        this.updateTokenInfo();
      } else {
        alert("Please install MetaMask to interact with this dApp.");
      }
    },
  },
  mounted() {
    this.initWeb3();
    setTimeout(() => {
      this.myComponent = 'MyComponent';
    }, 500);
  },
};
</script>

<style scoped>
/* Добавьте стили для компонента */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
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
