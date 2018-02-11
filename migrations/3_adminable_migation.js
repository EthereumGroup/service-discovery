var Adminable = artifacts.require('./Adminable.sol');

module.exports = function(deployer) {
    deployer.deploy(Adminable);
};
