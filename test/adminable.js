var utils = require("./utils.js");
var Adminable = artifacts.require("./Adminable.sol");

contract('adminable', function(accounts) {
    var contract;

    before('setup contract for each test', async function () {
        contract = await Adminable.deployed();
        assert.isFalse(await contract.isAdmin.call(accounts[1]));
    });

    it("Contract deployed", function(done) {
        done();
    });

    it("Ensure creator is admin", async function () {
        assert.isTrue(await contract.isAdmin.call(accounts[0]));
    });

    it("Add and remove one admin", async function () {
        await contract.add(accounts[1]);

        assert.isTrue(await contract.isAdmin.call(accounts[0]));
        assert.isTrue(await contract.isAdmin.call(accounts[1]));
        
        await contract.remove(accounts[1]);

        assert.isTrue(await contract.isAdmin.call(accounts[0]));
        assert.isFalse(await contract.isAdmin.call(accounts[1]));
    });

    it("Add, duplicate, remove, and duplicate remove one admin", async function () {
        await contract.add(accounts[1]);
        assert.isTrue(await contract.isAdmin.call(accounts[0]));
        assert.isTrue(await contract.isAdmin.call(accounts[1]));

        try {
            await contract.add(accounts[1]);
            throw "Expect duplicate add exception";
        } catch ( error ) {}
        
        await contract.remove(accounts[1]);
        assert.isTrue(await contract.isAdmin.call(accounts[0]));
        assert.isFalse(await contract.isAdmin.call(accounts[1]));

        try {
            await contract.remove(accounts[1]);
            throw "Expect duplicate remove exception";
        } catch ( error ) {}
    });

    it("Add, remove, 9 more admins", async function () {
        for (var i=1; i<10; ++i) {
            await contract.add(accounts[i]);
            assert.isTrue(await contract.isAdmin.call(accounts[i]));
        }

        for (var i=1; i<10; ++i) {
            await contract.remove(accounts[i]);
            assert.isFalse(await contract.isAdmin.call(accounts[i]));
        }

        await contract.remove(accounts[0]);
        assert.isFalse(await contract.isAdmin.call(accounts[0]));
        try {
            console.log(await contract.adminMap(10, 0));
            throw "Expect index out of bound exception";
        } catch (error) {}
    });
});
