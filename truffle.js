module.exports = {
    networks: {
        development: {
            host: "localhost",
            port: 8545,
            network_id: "*" // Match any network id
        },
        rinkeby: {
            // Make sure you setup Rinkeby connection through geth.
            // geth --rinkeby --rpc --rpcapi db,eth,net,web3,personal --unlock="0x7f96440b1891B1Af15833F8EbC4F7951aCB2ef4c"
            host: "localhost", // Connect to geth on the specified
            port: 8545,
            from: "0x7f96440b1891B1Af15833F8EbC4F7951aCB2ef4c", // default address to use for any transaction Truffle makes during migrations
            network_id: 4,
            gas: 5729615 // Gas limit used for deploys
        }
    }
};
