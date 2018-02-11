pragma solidity ^0.4.18;

/**
 * @title Registry
 * @dev This contract implements a fast lookup table for keys.
 */
contract Registry {

    uint8[256] private hBytes;  // Do not plan on supporting more than 2^16 entries
                               // The values stored in here are 1 based, not 0 based.
    uint256[] private lBytes;

    function Registry() public {
        hBytes = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
    }

    /**
     * @dev Get the number of entries in the registry.
     * @return The number of entries.
     */
    function size() public constant returns (uint _count) {
        _count = lBytes.length;
    }

    /**
     * @dev Get the high byte array. There are 256 uint8 array entries. The array can then be used by the caller.
     * @return The byte array entirely.
     */
    function getHighBytes() public constant returns(uint8[256] memory _highBytes) {
        _highBytes = hBytes;
    }

    /**
     * @dev Get the low bytes. The low bytes is an array, so must specify the index to indicate which low byte to retrieve.
     * @param _hIndex The index into the lBytes array.
     * @return The low byte as an uint256.
     */
    function getLowBytes(uint _hIndex) public constant returns(uint256 _lowBytes) {
        require (lBytes.length > _hIndex - 1);
    
        _lowBytes = lBytes[_hIndex - 1];
    }

    /**
     * @dev Check if a key exists in the registry
     * @param _k The key to check
     */
    function exists(uint16 _k) public view returns (bool) {
        if (_k == 0) return false;
    
        uint8 hIndex = uint8(_k >> 8);
        uint8 lIndex = uint8(_k & 255);

        uint8 hByte = hBytes[hIndex];
    
        if (hByte == 0) {
            return false;
        }

        if (lBytes.length <= hByte - 1) return false;
    
        uint256 lByte = lBytes[hByte - 1];

        if ((lByte & (uint(1) << lIndex)) == 0) {
            return false;
        }

        return true;
    }
    
    /**
     * @dev Pop a key from the registry
     * @param _k The key to remove
     */
    function pop(uint16 _k) public payable returns (uint16) {
        if (_k == 0) return _k;

        uint8 hIndex = uint8(_k >> 8);
        uint8 lIndex = uint8(_k & 255);

        uint8 hByte = hBytes[hIndex];
    
        if (hByte == 0) {
            return 0;
        }

        if (lBytes.length <= hByte - 1) return 0;
    
        uint256 lByte = lBytes[hByte - 1];

        if ((lByte & (uint(1) << lIndex)) == 0) {
            return 0;
        }

        lBytes[hByte - 1] = lBytes[hByte - 1] ^ (uint(1) << lIndex);

        return _k;
    }
    
    /**
     * @dev Add a key from the registry
     * @param _k The key to add
     */
    function push(uint16 _k) public payable {
        require (_k != 0);
    
        uint8 hIndex = uint8(_k >> 8);
        uint8 lIndex = uint8(_k & 255);

        uint8 hByte = hBytes[hIndex];
    
        if (hByte == 0) {
            hByte = uint8(lBytes.push(0));
            hBytes[hIndex] = hByte;
        }

        require (lBytes.length > hByte - 1);
    
        uint256 lByte = lBytes[hByte - 1];

        if ((lByte & (uint(1) << lIndex)) == 0) {
            lBytes[hByte - 1] = lBytes[hByte - 1] | (uint(1) << lIndex);
        }
    }
}
