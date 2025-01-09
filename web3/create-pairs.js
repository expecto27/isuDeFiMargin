const { ethers } = require("ethers");
const { abi: factoryABI } = require('@uniswap/v2-core/build/UniswapV2Factory.json');

// Провайдер (например, Infura или локальный узел)
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545");  // или используйте свой URL для провайдера

// Адрес фабрики, который вы развернули
const factoryAddress = "0xCD4643276c3Fe3a360E46130289346d6f7045486"; 

// Адреса токенов
const WETH = "0x8b9be2CF5d272De98202DEBd74b0f9148E863bA9";
const USDC = "0xF629BFc5d5A06cae5AF5ee178e99538e5616e49B";
const WBTC = "0x95749A89baBcD0bD16BeeCeE3A93811EC013AcB3";

// Ваш аккаунт (тот, который будет подписывать транзакции)
const privateKey = "0xa4a127096e1806a340e1bbef88fdc4df894a6261e58652a4c16722a9695021df"; // Приватный ключ вашего кошелька
const wallet = new ethers.Wallet(privateKey, provider);

// Создание контракта фабрики
const factoryContract = new ethers.Contract(factoryAddress, factoryABI, wallet);

async function createPairs() {
    try {
        console.log("Creating pairs...");

        // Создание пары WETH - USDC
        let tx = await factoryContract.createPair(WETH, USDC);
        console.log("Pair created: WETH - USDC", tx.hash);

        // Создание пары WETH - WBTC
        tx = await factoryContract.createPair(WETH, WBTC);
        console.log("Pair created: WETH - WBTC", tx.hash);

        // Создание пары USDC - WBTC
        tx = await factoryContract.createPair(USDC, WBTC);
        console.log("Pair created: USDC - WBTC", tx.hash);

        // Ожидаем подтверждения транзакций
        await tx.wait();
        console.log("All pairs created successfully!");
    } catch (error) {
        console.error("Error creating pairs:", error);
    }
}

// Запускаем функцию
createPairs();
