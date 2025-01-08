const TestToken = artifacts.require("TestToken");

module.exports = async function (deployer) {
    await deployer.deploy(TestToken, "Wrapped Ether", "WETH", web3.utils.toWei("1000"));
    await deployer.deploy(TestToken, "USD Coin", "USDC", web3.utils.toWei("1000000"));
    await deployer.deploy(TestToken, "Wrapped Bitcoin", "WBTC", web3.utils.toWei("100"));
};


//WETH 0x07AbFfD47b9D8AE62f06834282EAD22e8634B6d6
//USDC 0x8BC3A8e0c7D7f2562743D7e34012c41A356fCf7D
//WBTC 0x71Ec59b6a1e334DA8D44F615c2d6DCa2E28858ef