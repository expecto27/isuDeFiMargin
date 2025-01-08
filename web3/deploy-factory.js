const { ethers } = require("ethers");
const fs = require("fs");

// Подключаемся к Ganache
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545");
const wallet = new ethers.Wallet("0x90a173470053d7651028de40a54d4b8f075fe48b20669a5db1cf03716b3465f0", provider); // Замените на свой приватный ключ

// Загрузка ABI и байткода контракта Factory
const factoryAbi = JSON.parse(fs.readFileSync("./build/contracts/UniswapV2Factory.json")).abi;
const factoryBytecode = JSON.parse(fs.readFileSync("./build/contracts/UniswapV2Factory.json")).bytecode;

async function deployFactory() {
    console.log("Деплой Factory...");
    const FactoryContract = new ethers.ContractFactory(factoryAbi, factoryBytecode, wallet);
    const factory = await FactoryContract.deploy(wallet.address); // Владелец — текущий кошелек
    await factory.deployed();
    console.log("Factory развернут по адресу:", factory.address);
}

deployFactory().catch(console.error);

//factory 0xc4815a4713bf97374B3De110647174EF55a17372