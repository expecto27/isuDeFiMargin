const UniswapV2Router02 = artifacts.require("UniswapV2Router02");

module.exports = async function (deployer, network, accounts) {
    // Адрес уже развернутой фабрики (например, в Ganache или другом тестовом окружении)
    const factoryAddress = "0xceb12e895A91B802Deb6f7e3ae42d30337bd9C42"; // Укажите правильный адрес фабрики

    // Адрес WETH
    const WETH = "0x8b9be2CF5d272De98202DEBd74b0f9148E863bA9"; // Убедитесь, что это правильный адрес WETH

    // Развёртываем Router с переданными адресами фабрики и WETH
    await deployer.deploy(UniswapV2Router02, factoryAddress, WETH);
    const router = await UniswapV2Router02.deployed();

    console.log("UniswapV2Router02 deployed at:", router.address);
};
