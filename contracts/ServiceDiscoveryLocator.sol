pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';

/**
 * @title ServiceDiscoveryLocator
 * @dev This contract maintains the address and version of the ServiceDiscovery contract
 **/
contract ServiceDiscoveryLocator is Ownable {
    event ServiceChanged(address indexed _old, address indexed _new);

    address public serviceDiscoveryAddress;
    uint public version;

    /**
     * @dev The ServiceDiscoveryLocator constructor. Initialize internal fields.
     */
    function ServiceDiscoveryLocator() public {
        serviceDiscoveryAddress = 0x0;
        version = 0;
    }

    function () public payable {}
    
    /**
     * @dev Changes the address of the ServiceDiscoveryLocator. Only owner is allowed to do this.
     * @param _address The new address to set
     * @return Emits the ServiceChanged(old, new) event. No other returns.
     */
    function setAddress(address _address) public onlyOwner {
        address old = serviceDiscoveryAddress;
        
        serviceDiscoveryAddress = _address;
        version++;

        ServiceChanged(old, serviceDiscoveryAddress);
    }

    /**
     * @dev Allows the withdraw of donation funds.
     */
    function withdraw() public onlyOwner {
	uint256 etherBalance = this.balance;
	owner.transfer(etherBalance);
    }
}
