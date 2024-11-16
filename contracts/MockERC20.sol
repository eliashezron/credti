// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    uint256 public constant MINT_AMOUNT = 10000 * (10 ** 18);

    constructor() ERC20("Mock USDC", "mUSDC") {
        _mint(msg.sender, MINT_AMOUNT);
    } 
}
