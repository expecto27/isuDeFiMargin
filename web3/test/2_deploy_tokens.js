const TestToken = artifacts.require("TestToken");

module.exports = async function (deployer) {
    await deployer.deploy(TestToken, "Wrapped Ether", "WETH", web3.utils.toWei("1000"));
    await deployer.deploy(TestToken, "USD Coin", "USDC", web3.utils.toWei("1000000"));
    await deployer.deploy(TestToken, "Wrapped Bitcoin", "WBTC", web3.utils.toWei("100"));
};


//WETH 0x8b9be2CF5d272De98202DEBd74b0f9148E863bA9
//USDC 0xF629BFc5d5A06cae5AF5ee178e99538e5616e49B
//WBTC 0x95749A89baBcD0bD16BeeCeE3A93811EC013AcB3   