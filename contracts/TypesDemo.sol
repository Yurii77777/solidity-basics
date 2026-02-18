// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title TypesDemo
 * @notice Demonstrates Solidity basic types and data locations
 * @dev Educational contract for E3 episode
 */
contract TypesDemo {
    // ============ Value Types ============

    // Used for: token balances, counts, IDs, timestamps. Always >= 0. Default: 0
    uint256 public myUint;

    // Used for: temperature, coordinates, profit/loss calculations. Can be negative. Default: 0
    int256 public myInt;

    // Used for: feature flags (isPaused, hasVoted, isActive). Default: false
    bool public myBool;

    // Used for: user/contract identity, ownership, recipients. Default: 0x0000000000000000000000000000000000000000
    address public myAddress;

    // ============ String & Bytes ============

    // UTF-8 text. Used for: names, descriptions, metadata. EXPENSIVE in storage! Default: ""
    string public myString;

    // Raw binary data. Used for: signatures, encoded transactions. More efficient than string. Default: 0x (empty)
    bytes public myBytes;

    // Fixed 32 bytes. Used for: hashes (keccak256), IDs, keys. Most gas-efficient. Default: 0x0000...0000
    bytes32 public myBytes32;

    // ============ Uint Functions ============

    /**
     * @notice Set uint256 value
     * @param _value New uint value
     */
    function setUint(uint256 _value) public {
        myUint = _value;
    }

    /**
     * @notice Increment uint by 1 (demonstrates overflow protection in 0.8+)
     * @return New value after increment
     */
    function incrementUint() public returns (uint256) {
        myUint += 1;
        return myUint;
    }

    /**
     * @notice Get max uint256 value
     * @return Maximum uint256 value (2^256 - 1)
     */
    function getMaxUint() public pure returns (uint256) {
        return type(uint256).max;
    }

    // ============ Int Functions ============

    /**
     * @notice Set int256 value (can be negative)
     * @param _value New int value
     */
    function setInt(int256 _value) public {
        myInt = _value;
    }

    /**
     * @notice Get min and max int256 values
     * @return min Minimum int256 value (-2^255)
     * @return max Maximum int256 value (2^255 - 1)
     */
    function getIntLimits() public pure returns (int256 min, int256 max) {
        return (type(int256).min, type(int256).max);
    }

    // ============ Bool Functions ============

    /**
     * @notice Toggle boolean value
     */
    function toggleBool() public {
        myBool = !myBool;
    }

    /**
     * @notice Set boolean value
     * @param _value New bool value
     */
    function setBool(bool _value) public {
        myBool = _value;
    }

    // ============ Address Functions ============

    /**
     * @notice Set address value
     * @param _addr New address
     */
    function setAddress(address _addr) public {
        myAddress = _addr;
    }

    /**
     * @notice Get balance of stored address
     * @return Balance in wei
     */
    function getAddressBalance() public view returns (uint256) {
        return myAddress.balance;
    }

    /**
     * @notice Convert address to uint160 (demonstrates type conversion)
     * @param _addr Address to convert
     * @return Uint160 representation
     */
    function addressToUint(address _addr) public pure returns (uint160) {
        return uint160(_addr);
    }

    /**
     * @notice Convert uint160 to address (demonstrates type conversion)
     * @param _num Uint160 to convert
     * @return Address representation
     */
    function uintToAddress(uint160 _num) public pure returns (address) {
        return address(_num);
    }

    // ============ String Functions ============

    /**
     * @notice Set string value (memory parameter - copied to storage)
     * @param _str New string value
     */
    function setString(string memory _str) public {
        myString = _str;
    }

    /**
     * @notice Get string length using bytes conversion
     * @dev Strings cannot be indexed directly, convert to bytes first
     * @param _str String to measure (calldata - most gas efficient for external calls)
     * @return Length in bytes
     */
    function getStringLength(string calldata _str) external pure returns (uint256) {
        return bytes(_str).length;
    }

    /**
     * @notice Demonstrates memory vs calldata for strings
     * @dev Memory creates a copy, calldata is read-only reference
     * @param _memStr String in memory (copied)
     * @param _calldataStr String in calldata (reference, cheaper)
     * @return True if strings are equal
     */
    function compareMemoryVsCalldata(
        string memory _memStr,
        string calldata _calldataStr
    ) external pure returns (bool) {
        return keccak256(bytes(_memStr)) == keccak256(bytes(_calldataStr));
    }

    // ============ Bytes Functions ============

    /**
     * @notice Set dynamic bytes value
     * @param _data Bytes data
     */
    function setBytes(bytes memory _data) public {
        myBytes = _data;
    }

    /**
     * @notice Get length of stored bytes
     * @return Length in bytes
     */
    function getBytesLength() public view returns (uint256) {
        return myBytes.length;
    }

    /**
     * @notice Set fixed-size bytes32 value
     * @param _data Bytes32 data (e.g., hash)
     */
    function setBytes32(bytes32 _data) public {
        myBytes32 = _data;
    }

    /**
     * @notice Get first byte from bytes32 (demonstrates indexing)
     * @return First byte
     */
    function getFirstByteFromBytes32() public view returns (bytes1) {
        return myBytes32[0];
    }

    /**
     * @notice Convert string to bytes32 (fixed size)
     * @dev Only works for strings <= 32 bytes
     * @param _str String to convert
     * @return Fixed-size bytes32
     */
    function stringToBytes32(string memory _str) public pure returns (bytes32) {
        return bytes32(bytes(_str));
    }

    // ============ Data Location Demonstrations ============

    /**
     * @notice Demonstrates storage reference behavior
     * @dev Local storage variable creates a reference to state variable
     * @param _newValue New value to set
     */
    function storageReferenceDemo(string memory _newValue) public {
        // Direct assignment to state variable
        myString = _newValue;

        // Storage reference points to the same location as myString
        // Reading localRef gives the same value as myString
        string storage localRef = myString;

        // This demonstrates that localRef and myString are the same
        require(
            keccak256(bytes(localRef)) == keccak256(bytes(myString)),
            "Storage reference should point to same data"
        );
    }

    /**
     * @notice Demonstrates memory copy behavior
     * @return Original and modified strings (modified doesn't affect storage)
     */
    function memoryCopyDemo() public view returns (string memory, string memory) {
        // Memory creates an independent copy
        string memory localCopy = myString;

        // Modifying localCopy doesn't affect myString
        localCopy = "Modified in memory";

        return (myString, localCopy);
    }

    // ============ Helper/Utility Functions ============

    /**
     * @notice Get all value types at once
     * @return Current values of all basic types
     */
    function getAllValues()
        public
        view
        returns (
            uint256,
            int256,
            bool,
            address,
            string memory,
            bytes memory,
            bytes32
        )
    {
        return (myUint, myInt, myBool, myAddress, myString, myBytes, myBytes32);
    }

    /**
     * @notice Reset all values to defaults
     */
    function resetAll() public {
        delete myUint; // Sets to 0
        delete myInt; // Sets to 0
        delete myBool; // Sets to false
        delete myAddress; // Sets to 0x0
        delete myString; // Sets to ""
        delete myBytes; // Sets to empty bytes
        delete myBytes32; // Sets to 0x0...0
    }
}
