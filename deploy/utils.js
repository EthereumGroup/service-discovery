function unlockTest() {
    web3.personal.unlockAccount(eth.accounts[0],"", 15000);
    web3.personal.unlockAccount(eth.accounts[1],"", 15000);
    web3.personal.unlockAccount(eth.accounts[2],"", 15000);
    web3.personal.unlockAccount(eth.accounts[3],"", 15000);
    web3.personal.unlockAccount(eth.accounts[4],"", 15000);
};

function checkAllBalances() {
    var totalBal = 0;
    for (var acctNum in eth.accounts) {
        var acct = eth.accounts[acctNum];
        var acctBal = web3.fromWei(eth.getBalance(acct), "ether");
        totalBal += parseFloat(acctBal);
        console.log("  eth.accounts[" + acctNum + "]: \t" + acct + " \tbalance: " + acctBal + " ether");
    }
    console.log("  Total balance: " + totalBal + " ether");
};
