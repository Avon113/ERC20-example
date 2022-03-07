// SPDX-License-Identifier: No-license
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract KycContract is Ownable{
    mapping(address => bool) allowed;

    function setKycCompleted(address add_) public onlyOwner{
        allowed[add_] = true;
    }

    function setKycRevoked(address add_) public onlyOwner {
        allowed[add_] = false;
    }

    function kycCompleted(address add_) public view returns(bool) {
        return allowed[add_];
    }
}
