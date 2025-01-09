const UniswapV2Factory = artifacts.require("UniswapV2Factory");

module.exports = async function (deployer, network, accounts) {
    const owner = accounts[0]; // Используем первый аккаунт как владельца

    // Развёртываем Factory
    await deployer.deploy(UniswapV2Factory, owner);
    const factory = await UniswapV2Factory.deployed();

    console.log("UniswapV2Factory deployed at:", factory.address);
};