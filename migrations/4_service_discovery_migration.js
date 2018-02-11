var ServiceDiscovery = artifacts.require('./ServiceDiscovery.sol');

module.exports = function(deployer) {
    deployer.deploy(ServiceDiscovery);
};
