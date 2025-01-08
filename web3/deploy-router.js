const { ethers } = require("ethers");
const fs = require("fs");

// Подключаемся к Ganache
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545");
const wallet = new ethers.Wallet("0x90a173470053d7651028de40a54d4b8f075fe48b20669a5db1cf03716b3465f0", provider); // Замените на свой приватный ключ


const routerAbi = JSON.parse(fs.readFileSync("./build/contracts/UniswapV2Router02.json")).abi;
const routerBytecode = JSON.parse(fs.readFileSync("./build/contracts/UniswapV2Router02.json")).bytecode;

async function deployRouter(factoryAddress, wethAddress) {
    console.log("Деплой Router...");
    const RouterContract = new ethers.ContractFactory(routerAbi, routerBytecode, wallet);
    const router = await RouterContract.deploy(factoryAddress, wethAddress);
    await router.deployed();
    console.log("Router развернут по адресу:", router.address);
}

deployRouter("0xc4815a4713bf97374B3De110647174EF55a17372", "0x07AbFfD47b9D8AE62f06834282EAD22e8634B6d6").catch(console.error);


//router 0x2BF545E292e5740e6bbFc3A31bf208dc7929fE55