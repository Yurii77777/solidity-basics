// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title DataStructures
 * @notice Demonstrates arrays, structs, mappings, and nested mappings
 * @dev Educational contract for E4 episode — user registry theme
 */
contract DataStructures {
    // ============ Struct ============

    struct User {
        string name;
        uint256 balance;
        bool isActive;
        uint256 createdAt;
    }

    // ============ Events ============

    event ScoreUpdated(uint256 indexed index, uint256 score);
    event NumberAdded(uint256 number);
    event NumberRemoved(uint256 indexed index);
    event WhitelistAdded(address indexed addr);
    event WhitelistRemoved(uint256 indexed index);
    event UserCreated(uint256 indexed index, string name, uint256 balance);
    event UserDeactivated(uint256 indexed index);
    event BalanceUpdated(address indexed addr, uint256 newBalance);
    event ProfileCreated(address indexed addr, string name);
    event ProfileDeactivated(address indexed addr);
    event AllowanceSet(address indexed owner, address indexed spender, uint256 amount);
    event PermissionSet(address indexed user, uint256 indexed permissionId, bool granted);

    // ============ Fixed Array ============

    uint256[5] public topScores;

    // ============ Dynamic Arrays ============

    uint256[] public numbers;
    address[] public whitelist;

    // ============ Array of Structs ============

    User[] public users;

    // ============ Mappings ============

    mapping(address => uint256) public balances;
    mapping(address => User) public userProfiles;
    mapping(address => bool) public hasProfile;

    // ============ Nested Mappings ============

    // ERC-20 allowance pattern: owner => spender => amount
    mapping(address => mapping(address => uint256)) public allowances;

    // Role/permission pattern: user => permissionId => granted
    mapping(address => mapping(uint256 => bool)) public permissions;

    // ============ Fixed Array Functions ============

    /**
     * @notice Set a score in the fixed-size array
     * @param _index Array position (0-4)
     * @param _score Score value to set
     */
    function setScore(uint256 _index, uint256 _score) public {
        require(_index < 5, "Index out of bounds");
        topScores[_index] = _score;
        emit ScoreUpdated(_index, _score);
    }

    /**
     * @notice Get a score by index
     * @param _index Array position (0-4)
     * @return Score at the given index
     */
    function getScore(uint256 _index) public view returns (uint256) {
        require(_index < 5, "Index out of bounds");
        return topScores[_index];
    }

    /**
     * @notice Get all 5 scores at once
     * @return Copy of the entire fixed array
     */
    function getAllScores() public view returns (uint256[5] memory) {
        return topScores;
    }

    // ============ Dynamic Array Functions ============

    /**
     * @notice Push a number to the dynamic array
     * @param _number Value to add
     */
    function addNumber(uint256 _number) public {
        numbers.push(_number);
        emit NumberAdded(_number);
    }

    /**
     * @notice Remove a number by index using swap-and-pop (O(1), doesn't preserve order)
     * @param _index Position to remove
     */
    function removeNumberByIndex(uint256 _index) public {
        require(_index < numbers.length, "Index out of bounds");
        numbers[_index] = numbers[numbers.length - 1];
        numbers.pop();
        emit NumberRemoved(_index);
    }

    /**
     * @notice Get a number by index
     * @param _index Array position
     * @return Number at the given index
     */
    function getNumber(uint256 _index) public view returns (uint256) {
        require(_index < numbers.length, "Index out of bounds");
        return numbers[_index];
    }

    /**
     * @notice Get all numbers (gas cost scales with array size)
     * @return Copy of the entire dynamic array
     */
    function getAllNumbers() public view returns (uint256[] memory) {
        return numbers;
    }

    /**
     * @notice Get dynamic array length
     * @return Current number of elements
     */
    function getNumbersLength() public view returns (uint256) {
        return numbers.length;
    }

    // ============ Whitelist Functions ============

    /**
     * @notice Add an address to the whitelist
     * @param _addr Address to add
     */
    function addToWhitelist(address _addr) public {
        whitelist.push(_addr);
        emit WhitelistAdded(_addr);
    }

    /**
     * @notice Remove an address from the whitelist by index (swap-and-pop)
     * @param _index Position to remove
     */
    function removeFromWhitelist(uint256 _index) public {
        require(_index < whitelist.length, "Index out of bounds");
        whitelist[_index] = whitelist[whitelist.length - 1];
        whitelist.pop();
        emit WhitelistRemoved(_index);
    }

    /**
     * @notice Check if an address is in the whitelist (O(n) linear scan)
     * @param _addr Address to check
     * @return True if found in whitelist
     */
    function isWhitelisted(address _addr) public view returns (bool) {
        for (uint256 i = 0; i < whitelist.length; i++) {
            if (whitelist[i] == _addr) return true;
        }
        return false;
    }

    /**
     * @notice Get all whitelisted addresses (gas cost scales with array size)
     * @return Copy of the entire whitelist
     */
    function getWhitelist() public view returns (address[] memory) {
        return whitelist;
    }

    /**
     * @notice Get whitelist length
     * @return Current number of whitelisted addresses
     */
    function getWhitelistLength() public view returns (uint256) {
        return whitelist.length;
    }

    // ============ Struct (User Array) Functions ============

    /**
     * @notice Create a new user and push to the users array
     * @param _name User display name
     * @param _balance Initial balance
     */
    function createUser(string memory _name, uint256 _balance) public {
        users.push(User({
            name: _name,
            balance: _balance,
            isActive: true,
            createdAt: block.timestamp
        }));
        emit UserCreated(users.length - 1, _name, _balance);
    }

    /**
     * @notice Get user data by index
     * @param _index User position in the array
     * @return name User display name
     * @return balance User balance
     * @return isActive Whether the user is active
     * @return createdAt Timestamp of creation
     */
    function getUser(uint256 _index) public view returns (
        string memory name,
        uint256 balance,
        bool isActive,
        uint256 createdAt
    ) {
        require(_index < users.length, "Index out of bounds");
        User storage user = users[_index];
        return (user.name, user.balance, user.isActive, user.createdAt);
    }

    /**
     * @notice Deactivate a user by index
     * @param _index User position in the array
     */
    function deactivateUser(uint256 _index) public {
        require(_index < users.length, "Index out of bounds");
        users[_index].isActive = false;
        emit UserDeactivated(_index);
    }

    /**
     * @notice Get total number of users
     * @return Current length of the users array
     */
    function getUserCount() public view returns (uint256) {
        return users.length;
    }

    // ============ Mapping Functions ============

    /**
     * @notice Set balance for an address (overwrites previous value)
     * @param _addr Target address
     * @param _amount New balance
     */
    function setBalance(address _addr, uint256 _amount) public {
        balances[_addr] = _amount;
        emit BalanceUpdated(_addr, _amount);
    }

    /**
     * @notice Get balance for an address (returns 0 if never set)
     * @param _addr Target address
     * @return Balance value
     */
    function getBalance(address _addr) public view returns (uint256) {
        return balances[_addr];
    }

    /**
     * @notice Add to existing balance for an address
     * @param _addr Target address
     * @param _amount Amount to add
     */
    function addToBalance(address _addr, uint256 _amount) public {
        balances[_addr] += _amount;
        emit BalanceUpdated(_addr, balances[_addr]);
    }

    // ============ Profile (Mapping to Struct) Functions ============

    /**
     * @notice Create a profile for msg.sender (one per address)
     * @param _name Profile display name
     */
    function createProfile(string memory _name) public {
        require(!hasProfile[msg.sender], "Profile already exists");
        userProfiles[msg.sender] = User({
            name: _name,
            balance: 0,
            isActive: true,
            createdAt: block.timestamp
        });
        hasProfile[msg.sender] = true;
        emit ProfileCreated(msg.sender, _name);
    }

    /**
     * @notice Get profile data for an address
     * @param _addr Address to look up
     * @return name Profile display name
     * @return balance Profile balance
     * @return isActive Whether the profile is active
     * @return createdAt Timestamp of creation
     */
    function getProfile(address _addr) public view returns (
        string memory name,
        uint256 balance,
        bool isActive,
        uint256 createdAt
    ) {
        require(hasProfile[_addr], "Profile does not exist");
        User storage profile = userProfiles[_addr];
        return (profile.name, profile.balance, profile.isActive, profile.createdAt);
    }

    /**
     * @notice Deactivate the caller's profile
     */
    function deactivateProfile() public {
        require(hasProfile[msg.sender], "Profile does not exist");
        userProfiles[msg.sender].isActive = false;
        emit ProfileDeactivated(msg.sender);
    }

    /**
     * @notice Check if an address has a profile
     * @param _addr Address to check
     * @return True if profile exists
     */
    function profileExists(address _addr) public view returns (bool) {
        return hasProfile[_addr];
    }

    // ============ Nested Mapping: Allowance (ERC-20 pattern) ============

    /**
     * @notice Set spending allowance for another address (ERC-20 approve pattern)
     * @param _spender Address allowed to spend
     * @param _amount Maximum amount they can spend
     */
    function setAllowance(address _spender, uint256 _amount) public {
        allowances[msg.sender][_spender] = _amount;
        emit AllowanceSet(msg.sender, _spender, _amount);
    }

    /**
     * @notice Get allowance from owner to spender
     * @param _owner Token owner address
     * @param _spender Spender address
     * @return Allowed amount
     */
    function getAllowance(address _owner, address _spender) public view returns (uint256) {
        return allowances[_owner][_spender];
    }

    // ============ Nested Mapping: Permissions ============

    /**
     * @notice Grant or revoke a permission for a user
     * @param _user Target user address
     * @param _permissionId Permission identifier
     * @param _granted True to grant, false to revoke
     */
    function setPermission(address _user, uint256 _permissionId, bool _granted) public {
        permissions[_user][_permissionId] = _granted;
        emit PermissionSet(_user, _permissionId, _granted);
    }

    /**
     * @notice Check if a user has a specific permission
     * @param _user User address
     * @param _permissionId Permission identifier
     * @return True if permission is granted
     */
    function hasPermission(address _user, uint256 _permissionId) public view returns (bool) {
        return permissions[_user][_permissionId];
    }

    // ============ Utility ============

    /**
     * @notice Get counts of all dynamic collections
     * @return numbersCount Length of numbers array
     * @return whitelistCount Length of whitelist array
     * @return usersCount Length of users array
     */
    function getContractSummary() public view returns (
        uint256 numbersCount,
        uint256 whitelistCount,
        uint256 usersCount
    ) {
        return (numbers.length, whitelist.length, users.length);
    }
}
