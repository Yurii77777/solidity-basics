// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract FirstContract {
    string public message;

    constructor() {
        message = "Hey, what's up?";
    }

    function setMessage(string memory _message) public {
        message = _message;
    }
}
