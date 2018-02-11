pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import './Adminable.sol';
import './Registry.sol';

/**
 * @title ServiceDiscovery
 * @dev This contract maintains registries of services and their service URIs
 **/
contract ServiceDiscovery is Ownable {
    Registry public registry;

    /**
     * This is pretty ugly stuff I admit. I would have wanted this to be inheritted. But it
     * blows through gas limitation of the ethereum block. I couldn't find a solution to this.
     * Below, as you will see, I implemented some APIs as pure wrappers around the Adminable
     * contract.
     **/
    address public adminContract;

    struct Service {
        bytes32 name;
        Registry serviceRegistry;
        mapping (uint16 => string[]) serviceURIs;
    }
    mapping (uint16 => Service) public registryMap;

    /**
     * @dev The ServiceDiscovery constructor. Initialize internal fields.
     */
    function ServiceDiscovery() public {
        registry = new Registry();
        adminContract = 0x0;
    }

    /**
     * @dev Throws if called by any account other than the admin.
     */
    modifier onlyAdmin() {
        require(isAdmin(msg.sender));
        _;
    }

    /**
     * @dev Set the Adminable contract address. Only owner is allowed to do this.
     * @param _adminContractAddress The address of the Adminable contract
     */
    function setAdmin(address _adminContractAddress) public onlyOwner {
        require (_adminContractAddress != 0x0);
        
        adminContract = _adminContractAddress;
    }
    
    function isAdmin(address _admin) private view returns (bool) {
        require (adminContract != 0x0);
        Adminable adminable = Adminable(adminContract);
        return adminable.isAdmin(_admin);
    }
    
    /**
     * @dev Checks if a service exists
     * @param _k The key of the service
     * @return true if the service exists, false otherwise.
     */
    function serviceExists(uint16 _k) public view returns (bool) {
        return registry.exists(_k);
    }
    
    /**
     * @dev Checks if an URI exists
     * @param _k The key of the service the URI belongs to
     * @param _uri The URI to check
     * @return true if the URI for the service exists, false otherwise.
     */
    function uriExists(uint16 _k, string _uri) public view returns (bool) {
        if (!serviceExists(_k)) return false;

        uint16 key = uint16(uint(keccak256(_uri)) & 0xFFFF);

        return registryMap[_k].serviceRegistry.exists(key);
    }
    
    /**
     * @dev Add a service and uri. This creates the service structure if it does not exist. Only admins are allowed to do this.
     * @param _k The key of the service
     * @param _name A name for easily readablilty
     * @param _uri The URI to add
     */
    function add(uint16 _k, bytes32 _name, string _uri) public onlyAdmin {
        if (!serviceExists(_k)) {
            registry.push(_k);
            registryMap[_k] = Service({name: _name, serviceRegistry:new Registry()});
        }

        uint16 key = uint16(uint(keccak256(_uri)) & 0xFFFF);

        registryMap[_k].serviceRegistry.push(key);
        registryMap[_k].name = _name;
        
        for (uint i = 0; i < registryMap[_k].serviceURIs[key].length; i++) {
            require (keccak256(registryMap[_k].serviceURIs[key][i]) != keccak256( _uri ));
        }
        
        registryMap[_k].serviceURIs[key].push(_uri);
    }

    /**
     * @dev Remove a service and uri. This does not remove the service structure, just clears up the URI mappings. Only admins are allowed to do this.
     * @param _k The key of the service
     * @param _uri The URI to add
     */
    function remove(uint16 _k, string _uri) public onlyAdmin {
        require (serviceExists(_k));

        require (uriExists(_k, _uri));

        uint16 key = uint16(uint(keccak256(_uri)) & 0xFFFF);
        
        for (uint i = 0; i<registryMap[_k].serviceURIs[key].length; i++){
            if (keccak256(registryMap[_k].serviceURIs[key][i]) == keccak256( _uri )) {
                break; // Choose speed over extremely rare incorrectness?
            }
        }
        for ( ; i<registryMap[_k].serviceURIs[key].length - 1; i++) {
            registryMap[_k].serviceURIs[key][i] = registryMap[_k].serviceURIs[key][i+1];
        }
            
        for (; i<registryMap[_k].serviceURIs[key].length; i++){
            delete registryMap[_k].serviceURIs[key][i];
        }
            
        registryMap[_k].serviceURIs[key].length = i - 1;

        if (0 == registryMap[_k].serviceURIs[key].length) {
            // remove from registry
            registryMap[_k].serviceRegistry.pop(key);
        }
    }
}
