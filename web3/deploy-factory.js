const { ethers } = require("ethers");
const fs = require("fs");

// Подключаемся к Ganache
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545");
const wallet = new ethers.Wallet("0xa4a127096e1806a340e1bbef88fdc4df894a6261e58652a4c16722a9695021df", provider); // Замените на свой приватный ключ

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

//factory 0xA6621560131F7Fba96790cD7C92B8ADbECC69F90