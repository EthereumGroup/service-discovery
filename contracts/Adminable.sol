pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import "./Registry.sol";

/**
 * @title Adminable
 * @dev The Adminable contract maintains a list of administrators, and provides basic authorization control
 * functions. This allows the APIs to enforce administrator checks.
 */
contract Adminable is Ownable, Registry {
    mapping (uint16 => address[]) public adminMap;

    /**
     * @dev The Adminable constructor adds the original `owner` of the contract to the admin
     * list.
     */
    function Adminable() public {
        add(msg.sender);
    }

    /**
     * @dev Throws if called by any account other than the admin.
     */
    modifier onlyAdmin() {
        require(isAdmin(msg.sender));
        _;
    }

    /**
     * @dev Checks if someone is an admin
     * @param _admin The address to check
     * @return true if the address passed in is an admin, false otherwise.
     */
    function isAdmin(address _admin) public view returns (bool) {
        uint16 key = uint16(uint(keccak256(_admin)) & 0xFFFF);

        if (!Registry.exists(key)) return false;

        if (adminMap[key].length <= 0) return false;
        
        for (uint i = 0; i < adminMap[key].length; i++) {
            if (adminMap[key][i] == _admin) return true;
        }

        return false;
    }
    
    /**
     * @dev Add an address to the admin list. Only contract owner can do this.
     * @param _admin The address to add
     */
    function add(address _admin) public onlyOwner {
        uint16 key = uint16(uint(keccak256(_admin)) & 0xFFFF);

        Registry.push(key);

        for (uint i = 0; i < adminMap[key].length; i++) {
            require (adminMap[key][i] != _admin);
        }

        adminMap[key].push(_admin);
    }

    /**
     * @dev Remove an address from the admin list. Only contract owner can do this.
     * @param _admin The address to remove
     */
    function remove(address _admin) public onlyOwner {
        require (isAdmin(_admin));
        
        uint16 key = uint16(uint(keccak256(_admin)) & 0xFFFF);
        
        for (uint i = 0; i<adminMap[key].length; i++){
            if (adminMap[key][i] == _admin) {
                break;
            }
        }
        for ( ; i<adminMap[key].length - 1; i++) {
            adminMap[key][i] = adminMap[key][i+1];
        }
            
        for (; i<adminMap[key].length; i++){
            delete adminMap[key][i];
        }
            
        adminMap[key].length = i - 1;

        if (0 == adminMap[key].length) {
            // remove from registry
            Registry.pop(key);
        }
    }
}
