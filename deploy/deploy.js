loadScript("target/deploy.js")

var adminableJsonContract = adminableContractContent.contracts["contracts/Adminable.sol:Adminable"];
var adminableContract = web3.eth.contract(JSON.parse(adminableJsonContract.abi));
var gasValue = eth.estimateGas({data:"0x"+adminableJsonContract.bin}) * 2;

var adminable = adminableContract.new({ from: eth.accounts[0], data: "0x" + adminableJsonContract.bin, gas:gasValue, gasPrice: '2000000000'}, function(e, contract){
    if(!e) {
	if(!contract.address) {
	    console.log("Adminable Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
	} else {
	    console.log("Adminable Contract mined! Address: " + contract.address);
	}
    }
});

var serviceDiscoveryLocatorJsonContract = serviceDiscoveryLocatorContractContent.contracts["contracts/ServiceDiscoveryLocator.sol:ServiceDiscoveryLocator"];
var serviceDiscoveryLocatorContract = web3.eth.contract(JSON.parse(serviceDiscoveryLocatorJsonContract.abi));
var gasValue = eth.estimateGas({data:"0x"+serviceDiscoveryLocatorJsonContract.bin}) * 2;

var serviceDiscoveryLocator = serviceDiscoveryLocatorContract.new({ from: eth.accounts[0], data: "0x" + serviceDiscoveryLocatorJsonContract.bin, gas:gasValue, gasPrice: '2000000000'}, function(e, contract){
    if(!e) {
	if(!contract.address) {
	    console.log("ServiceDiscoveryLocator Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
	} else {
	    console.log("ServiceDiscoveryLocator Contract mined! Address: " + contract.address);
	}
    }
});

var serviceDiscoveryJsonContract = serviceDiscoveryContractContent.contracts["contracts/ServiceDiscovery.sol:ServiceDiscovery"];
var serviceDiscoveryContract = web3.eth.contract(JSON.parse(serviceDiscoveryJsonContract.abi));
var gasValue = eth.estimateGas({data:"0x"+serviceDiscoveryJsonContract.bin});

var serviceDiscovery = serviceDiscoveryContract.new({ from: eth.accounts[0], data: "0x" + serviceDiscoveryJsonContract.bin, gas:gasValue, gasPrice: '2000000000'}, function(e, contract){
    if(!e) {
	if(!contract.address) {
	    console.log("ServiceDiscovery Contract transaction send: TransactionHash: " + contract.transactionHash + " waiting to be mined...");
	} else {
	    console.log("ServiceDiscovery Contract mined! Address: " + contract.address);
	}
    }
});
