var ServiceDiscoveryLocator = artifacts.require("./ServiceDiscoveryLocator.sol");
var utils = require("./utils.js");

contract('ServiceDiscoveryLocator', function(accounts) {
    before('setup contract for each test', async function () {
        contract = await ServiceDiscoveryLocator.deployed();
        assert.equal((await contract.version.call()).toNumber(), 0);

        /*
          old watch event method
        event = contract.ServiceChanged(function(error, result) {
            if (!error)
                console.log(result);

            event.stopWatching();
        });
        */
    });

    it("Contract deployed", function(done) {
        done();
    });

    it("Owner can set addresses and check version and events", async function () {
        await contract.serviceDiscoveryAddress.call().then( function(result) {
            assert.equal(result, 0x0);
        });
        
        await contract.setAddress(accounts[5]);
        utils.assertEvent(contract, { event: "ServiceChanged", args: { _old: "0x0000000000000000000000000000000000000000",
                                                                       _new: web3.toHex(accounts[5]) } });
        assert.equal((await contract.version.call()).toNumber(), 1);
        await contract.serviceDiscoveryAddress.call().then( function(result) {
            assert.equal(result, accounts[5]);
        });
        
        await contract.setAddress(0x0);
        utils.assertEvent(contract, { event: "ServiceChanged", args: { _new: "0x0000000000000000000000000000000000000000",
                                                                       _old: web3.toHex(accounts[5]) } });
        assert.equal((await contract.version.call()).toNumber(), 2);        
        await contract.serviceDiscoveryAddress.call().then( function(result) {
            assert.equal(result, 0x0);
        });
    });
            
});
