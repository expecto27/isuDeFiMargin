const MarginTrading = artifacts.require("MarginTrading");

module.exports = async function(deployer, network, accounts) {
    // Развёртывание контракта MarginTrading
    await deployer.deploy(MarginTrading);
    const marginTrading = await MarginTrading.deployed();

    console.log("MarginTrading deployed at:", marginTrading.address);
};
