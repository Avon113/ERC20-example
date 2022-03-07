// SPDX-License-Identifier: No-license
pragma solidity ^0.8.0;

import "./Crowdsale.sol";
import "./KycContract.sol";

contract MyTokenSale is Crowdsale{
    KycContract _kyc;
    constructor(
        uint256 rate_,    // rate in TKNbits
        address payable wallet_,
        IERC20 token_,
        KycContract kyc_
    ) Crowdsale(rate_, wallet_, token_) {
        _kyc = kyc_;
    }

    function _preValidatePurchase(address beneficiary_, uint256 weiAmount_) internal view override {
        super._preValidatePurchase(beneficiary_, weiAmount_);
        require(_kyc.kycCompleted(beneficiary_), "KYC not completed yet, aborting");
    }
}
