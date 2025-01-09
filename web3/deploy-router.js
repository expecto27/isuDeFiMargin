const { ethers } = require("ethers");
const fs = require("fs");

// Подключаемся к Ganache
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545");
const wallet = new ethers.Wallet("0xa4a127096e1806a340e1bbef88fdc4df894a6261e58652a4c16722a9695021df", provider); // Замените на свой приватный ключ


const routerAbi = JSON.parse(fs.readFileSync("./build/contracts/UniswapV2Router02.json")).abi;
const routerBytecode = JSON.parse(fs.readFileSync("./build/contracts/UniswapV2Router02.json")).bytecode;

async function deployRouter(factoryAddress, wethAddress) {
    console.log("Деплой Router...");
    const RouterContract = new ethers.ContractFactory(routerAbi, routerBytecode, wallet);
    const router = await RouterContract.deploy(factoryAddress, wethAddress);
    await router.deployed();
    console.log("Router развернут по адресу:", router.address);
}

deployRouter("0xA6621560131F7Fba96790cD7C92B8ADbECC69F90", "0x8b9be2CF5d272De98202DEBd74b0f9148E863bA9").catch(console.error);


//router 0x2D17619B62abF4f967dD619c68eDa26D02F9353d