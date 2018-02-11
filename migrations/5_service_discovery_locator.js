var ServiceDiscoveryLocator = artifacts.require('./ServiceDiscoveryLocator.sol');

module.exports = function(deployer) {
    deployer.deploy(ServiceDiscoveryLocator);
};
