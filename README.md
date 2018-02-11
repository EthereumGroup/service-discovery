Service Discovery Registry
=========================

This implements a service discovery registry, that acts as a broker for distributed systems.

I have started a comment thread here. I will be gladly field any questions anyone might have. http://forum.ethereum.org/discussion/17079/request-for-comment-distrubited-hashtable-sc

This registry has the following features:

1. Tranferable ownership.
2. Allows list of administrators for service discovery maintenance.
3. Allows addition of a new service by the administrators into the registry.
4. Allows the administrators to add service URIs to the service.
5. Allows the administrators to remove service URIs from the service.
6. The registry allows external apps to retrieve the list of services.
7. The registry allows external apps to retrieve all the URIs providing the services.
8. Have the ability to traverse the registry, thus allowing the service to be relocated in the future.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [License](#license)
- [Code](#code)
  - [Registry.sol](#registrysol)
  - [Adminable.sol](#adminablesol)
  - [ServiceRegistry.sol](#serviceregistrysol)
  - [ServiceRegistryLocator.sol](#serviceregistrylocatorsol)
- [TODO](#todo)
- [Setup](#setup)
- [Test](#test)
- [Deploy to Rinkeby](#deploy-to-rinkeby)
- [Deploy to live](#deploy-to-live)
- [Cost Analysis On Rinkeby](#cost-analysis-on-rinkeby)
  - [Gas Usage Using Truffle Migrate](#gas-usage-using-truffle-migrate)
  - [Gas Usage Using Solc Compiler With Optimization](#gas-usage-using-solc-compiler-with-optimization)
- [Donations](#donations)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## License ##

Be advised that while we strive to provide professional grade, tested code we cannot guarantee its fitness for your application. This is released under [The MIT License (MIT)](https://github.com/EthereumGroup/DiscoveryService/blob/master/LICENSE "MIT License") and as such we will not be held liable for lost funds, etc. Please use your best judgment and note the following:

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Code ##

The code has 4 main contracts, and they are explained below. I am open to the idea of moving
the core modules out separately. Please send me your feedbacks. 

### Registry.sol ###

This contract is the base contract for all later contracts. It is meant to store a lookup
registry that can provide near constant time lookup of key existence.

For 2^16-1 entries, the lookup is only 2 array lookups, and a few bitwise operations to
locate the mapping key. This allows fast search of keys, and offer the ability for removal.
And this table allows the traversal of the stored keys for listing.

In contrast, if this were implemented as a linkedlist, the amount of time to lookup the
existent of the key is an O(n) operation, which is would be too costly, in both performance
and cost.

### Adminable.sol ###

Modelled after the OpenZeppelin Ownable contract, this contract allows its users to check
if the caller is in its admins list. If so, the access is granted. If not, the access is denied.

### ServiceRegistry.sol ###

This contract puts combines the Registry and Adminable contracts, to provide a contract that
provides the ability to add/delete services, and add/delete URIs for services.

The service key is a 16-bit unsigned integer, except zero. I am not sure how to assign/partition
the numbers. And this decision is not something I want to tackle by myself anyway.

### ServiceRegistryLocator.sol ###

This contract provides an address locator for the ServiceRegistry contract. External applications
should use this contract to locate the latest ServiceRegistry contract. This is to future proof
the ServiceRegistry contract, so that the contract can be improved, and redeployed.

## TODO ##

Need to study reentracy concerns. Since we call contracts by address, we should ensure we are not
calling ourselves. Not sure if this is of concern. But we are not dealing with money here, so I am
going to leave it alone for now. It will just add complexity to the code.

## Setup ##

To setup the code, run the following command on a fresh instace of Debian/Ubuntu

```
apt-get install -y build-essential
make
```

## Test ##

To run test, run the following command. It will start Ganache CLI testnet locally, and trigger truffle tests to run, then terminates the Ganache CLI testnet.

```
make test
```

If you have Ganache CLI started separately, like if you want to debug the code, you should use the following for test:

```
truffle test
```

## Deploy to Rinkeby ##

Deploy the code on the Rinkeby testnet.

1) Setup connection to Rinkeby on localhost: geth --rinkeby --rpc --rpcapi db,eth,net,web3,personal --unlock="<account address>"
2) Run at least the following migration commands:
```
truffle migrate --network rinkeby -f 1
truffle migrate --network rinkeby -f 3
```

Existing contract addresses for review (solc version: 0.4.19+commit.c4cbbb05.Linux.g++):

Adminable: 0x2014ff3d03e8e8b269d15f4db48cb319e7f20aa3
ServiceRegistryLocator: 0xd4d0307fe7e718f364f56119ce9fcf491ae0bdb4
ServiceRegistry: 0x24e656df01363aeb62ccb04d7a4bf1e66c569dce

## Deploy to live ##

Not available at this time.

## Cost Analysis On Rinkeby ##

### Gas Usage Using Truffle Migrate ###

| Contract | Gas Used | Tranaction Hash |
| -------- |----------| ----------------|
| Adminable | 3,026,793 | https://rinkeby.etherscan.io/tx/0x9e4ae21d17991f4120e5d891d78f608834a5032f9f3ec87eae90ac15a31bcbad |
| ServiceRegistryLocator | 422,873 | https://rinkeby.etherscan.io/tx/0x89919f54f71f49ba4b8015fb92554a34342eab9923e0ea96695e4f55575ca2c5 |
| ServiceRegistry | 4,927,791 | https://rinkeby.etherscan.io/tx/0x9fb32da16d1a21d84c70559224a86a10c7b6f6c6d718593a817be1ecdf922581 |

### Gas Usage Using Solc Compiler With Optimization  ###

Using GMake system, I was able to build the project using native solc (0.4.19+commit.c4cbbb05.Linux.g++)
compiler. And using simple bootstraping deployment code, I was able to deploy to rinkeby manually.
Message me if you need additional information on how to do this. The make targets are named solc*.

This method does not run any test cases, so it is only used for optimization and gathering other useful
code stats that are hidden by Truffle.

| Contract | Gas Used | Tranaction Hash |
| -------- |----------| ----------------|
| Adminable | 2,593,076 | https://rinkeby.etherscan.io/tx/0x2faed26bb03d9cc67a7aeb99c7c6a53376d3b1bb6e001e3797c98c8869192504 |
| ServiceRegistryLocator | 257,306 | https://rinkeby.etherscan.io/tx/0x8c4d1cabe4677863a4f86e58796dda76b801d93750127cb319ecaeb3c8006b33 |
| ServiceRegistry | 4,168,901 | https://rinkeby.etherscan.io/tx/0x001285d84739bcef76f2e31850676f574b5b3cf7613b7841b763d82a15c843c9 |

## Donations ##

If you find the code in here useful, please consider donating to:

0xFc22F2b97Bf928934A1e1fD423Bd6518A2E3026F (ETH)
