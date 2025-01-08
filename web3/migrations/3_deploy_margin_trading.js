const MarginTrading = artifacts.require("MarginTrading");

module.exports = async function (deployer) {
    const uniswapRouter = "0x2BF545E292e5740e6bbFc3A31bf208dc7929fE55"; // Замените на адрес Router
    const collateralToken = "0x07AbFfD47b9D8AE62f06834282EAD22e8634B6d6"; // Замените на адрес WETH
    const borrowToken = "0x07AbFfD47b9D8AE62f06834282EAD22e8634B6d6"; // Замените на адрес USDC

    await deployer.deploy(MarginTrading, uniswapRouter, collateralToken, borrowToken);
};
