var Registry = artifacts.require("./Registry.sol");

contract("Registry", function (accounts) {
    var contract;

    before('setup contract for each test', async function () {
        contract = await Registry.deployed();
    });

    it("Contract deployed", function(done) {
        done();
    });

    it("should have size 1 and all zeros on init", async function () {
        const result = await contract.size.call();
        assert.equal(result.toNumber(), 0);

        const hBytes = await contract.getHighBytes();
        for(var i=0; i<256; ++i) {
            assert.equal(hBytes[i], 0);
        }
    });

    it("adding zero not allowed", async function () {
        try {
            await contract.push(0);
        } catch (error) {
            // Expect error
            console.log(error.message);
        }

        assert.isFalse( await contract.exists(0) );
    });

    it("remove zero not allowed", async function () {
        try {
            await contract.pop(0);
        } catch (error) {
            // Expect error
            console.log(error.message);
        }
    });

    it("adding one key (= 1) and data", async function () {
        var k = 1; //0x1
        var k1 = k >> 8;
        var k2 = k & 255;

        await contract.push(k);
        
        const result = await contract.size.call();
        assert.equal(result.toNumber(), 1);

        const hBytes = await contract.getHighBytes();
        for(var i=1; i<256; ++i) {
            assert.equal(hBytes[i], 0);
        }
        assert.equal(hBytes[0].toNumber(), k1+1 );

        const lBytes = await contract.getLowBytes(1);
        assert.isFalse(lBytes.isZero());
        var val = web3.toBigNumber("0x2");
        assert.isTrue(lBytes.eq(val));

        assert.isTrue( await contract.exists(k) );

        await contract.pop(k);

        assert.isFalse( await contract.exists(k) );
    });

    it("adding one key (< 10) and data", async function () {
        var k = 9; //0x200
        var k1 = k >> 8;
        var k2 = k & 255;

        await contract.push(k);
        
        const result = await contract.size.call();
        assert.equal(result.toNumber(), 1);

        const hBytes = await contract.getHighBytes();
        for(var i=1; i<256; ++i) {
            assert.equal(hBytes[i], 0);
        }
        assert.equal(hBytes[0].toNumber(), k1+1 );

        const lBytes = await contract.getLowBytes(1);
        assert.isFalse(lBytes.isZero());
        var val = web3.toBigNumber("0x200");
        assert.isTrue(lBytes.gte(val));

        assert.isTrue( await contract.exists(k) );

        await contract.pop(k);

        assert.isFalse( await contract.exists(k) );
    });

    it("adding one key (< 256) and data", async function () {
        var k = 255; //0x8000000000000000000000000000000000000000000000000000000000000000
        var k1 = k >> 8;
        var k2 = k & 255;

        await contract.push(k);
        
        const result = await contract.size.call();
        assert.equal(result.toNumber(), 1);

        const hBytes = await contract.getHighBytes();
        for(var i=1; i<256; ++i) {
            assert.equal(hBytes[i], 0);
        }
        assert.equal(hBytes[0].toNumber(), k1+1);

        const lBytes = await contract.getLowBytes(1);
        assert.isFalse(lBytes.isZero());

        var val = web3.toBigNumber("0x8000000000000000000000000000000000000000000000000000000000000000");
        assert.isTrue(lBytes.eq(val));

        assert.isTrue( await contract.exists(k) );

        await contract.pop(k);

        assert.isFalse( await contract.exists(k) );
    });

    it("adding one key (= 256) and data", async function () {
        var k = 256; //0x10000000000000000000000000000000000000000000000000000000000000000
        var k1 = k >> 8;
        var k2 = k & 255;

        await contract.push(k);
        
        const result = await contract.size.call();
        assert.equal(result.toNumber(), 2);

        const hBytes = await contract.getHighBytes();
        for(var i=2; i<256; ++i) {
            assert.equal(hBytes[i], 0);
        }
        assert.equal(hBytes[1].toNumber(), k1+1);

        const lBytes = await contract.getLowBytes(2);
        assert.isFalse(lBytes.isZero());

        var val = web3.toBigNumber("0x1");
        assert.isTrue(lBytes.eq(val));

        assert.isTrue( await contract.exists(k) );

        await contract.pop(k);

        assert.isFalse( await contract.exists(k) );
    });

    it("Non-existant keys don't exist", async function () {
        assert.isFalse( await contract.exists(0) );
        assert.isFalse( await contract.exists(7) );
        assert.isFalse( await contract.exists(100) );
        assert.isFalse( await contract.exists(257) );
    });
});
