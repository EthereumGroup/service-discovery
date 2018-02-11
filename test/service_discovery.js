var Adminable = artifacts.require("./Adminable.sol");
var ServiceDiscovery = artifacts.require("./ServiceDiscovery.sol");

contract('ServiceDiscovery', function(accounts) {
    var contract;
    var adminContract;
    
    before('setup contract for each test', async function () {
        contract = await ServiceDiscovery.deployed();
        adminContract = await Adminable.deployed();
/*
        console.log("ServiceDiscovery Contract Address: " + contract.address);
        console.log("Adminable Contract Address: " + adminContract.address);
        await adminContract.owner.call().then( function(result) {
            console.log("old owner:" + result) //will log results.
        });
        
        await adminContract.transferOwnership(contract.address);
        await adminContract.owner.call().then( function(result) {
            console.log("new owner:" + result) //will log results.
        });
  */      
        await contract.setAdmin(adminContract.address);
    });

    it("Contract deployed", function(done) {
        done();
    });

    it("Remove non-existent service", async function () {
        try {
            await contract.remove(0xFFFF, "https://www.google.com");
            throw "Expect duplicate remove exception";
        } catch ( error ) {}
    });

    it("Add and remove one service with 1 uri", async function () {
        assert.isFalse(await contract.serviceExists.call(0x0001));
        assert.isFalse(await contract.uriExists.call(0x0001, "https://www.google.com"));

        await contract.add(0x0001, "Service1", "https://www.google.com");

        assert.isTrue(await contract.serviceExists.call(0x0001));
        assert.isTrue(await contract.uriExists.call(0x0001, "https://www.google.com"));
        
        await contract.remove(0x0001, "https://www.google.com");

        assert.isTrue(await contract.serviceExists.call(0x0001));
        assert.isFalse(await contract.uriExists.call(0x0001, "https://www.google.com"));
    });

    it("Add and remove one service with 2 uris", async function () {
        assert.isFalse(await contract.uriExists.call(0x0001, "https://www.google.com"));
        assert.isFalse(await contract.uriExists.call(0x0001, "http://www.google.com"));

        await contract.add(0x0001, "Service1", "https://www.google.com");
        await contract.add(0x0001, "Service1", "http://www.google.com");

        assert.isTrue(await contract.serviceExists.call(0x0001));
        assert.isTrue(await contract.uriExists.call(0x0001, "https://www.google.com"));
        assert.isTrue(await contract.uriExists.call(0x0001, "http://www.google.com"));
        
        await contract.remove(0x0001, "https://www.google.com");

        assert.isTrue(await contract.serviceExists.call(0x0001));
        assert.isFalse(await contract.uriExists.call(0x0001, "https://www.google.com"));
        assert.isTrue(await contract.uriExists.call(0x0001, "http://www.google.com"));

        await contract.remove(0x0001, "http://www.google.com");

        assert.isTrue(await contract.serviceExists.call(0x0001));
        assert.isFalse(await contract.uriExists.call(0x0001, "https://www.google.com"));
        assert.isFalse(await contract.uriExists.call(0x0001, "http://www.google.com"));
    });

    it("Add, duplicate, remove, and duplicate remove one service", async function () {
        await contract.add(0x0001, "Service1", "https://www.google.com");
        assert.isTrue(await contract.uriExists.call(0x0001, "https://www.google.com"));

        try {
            await contract.add(0x0001, "Service1", "http://www.google.com");
            throw "Expect duplicate add exception";
        } catch ( error ) {}
        
        await contract.remove(0x0001, "https://www.google.com");

        assert.isTrue(await contract.serviceExists.call(0x0001));
        assert.isFalse(await contract.uriExists.call(0x0001, "https://www.google.com"));

        try {
            await contract.remove(0x0001, "https://www.google.com");
            throw "Expect duplicate remove exception";
        } catch ( error ) {}
    });
});
