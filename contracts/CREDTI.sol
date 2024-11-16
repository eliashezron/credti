// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@reclaimprotocol/verifier-solidity-sdk/contracts/Reclaim.sol";
import "@reclaimprotocol/verifier-solidity-sdk/contracts/Addresses.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract CREDTI {
    address public owner;
    address public reclaimAddress;
    address public usdcToken;

    uint256 public immutable BASIS_POINTS = 10000; // Basis points constant
    uint256 public interestRate; // Annual interest rate in basis points

    struct Loan {
        uint256 amount;
        uint256 dueDate;
        bool repaid;
    }

    mapping(address => Loan) public loans; // Tracks active loans for users

    // Events
    event LoanIssued(address indexed user, uint256 amount, uint256 dueDate);
    event LoanRepaid(address indexed user, uint256 amount);
    event LoanDefaulted(address indexed user);
    event VaultFunded(address indexed funder, uint256 amount);
    event Withdrawal(address indexed owner, uint256 amount);
    event EmergencyPaused(bool paused);

    bool public paused; // Emergency pause state

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier notPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    constructor(
        address _reclaimAddress,
        address _usdcToken,
        uint256 _interestRate
    ) {
        owner = msg.sender;
        reclaimAddress = _reclaimAddress;
        usdcToken = _usdcToken;
        interestRate = _interestRate;
    }

    // Verifies the user's off-chain creditworthiness using Reclaim
    function verifyProof(Reclaim.Proof memory proof) internal view {
        Reclaim(reclaimAddress).verifyProof(proof);
    }

    // Fund the contract with USDC
    function fundVault(uint256 amount) external notPaused {
        require(amount > 0, "Funding amount must be greater than zero");
        IERC20(usdcToken).transferFrom(msg.sender, address(this), amount);
        emit VaultFunded(msg.sender, amount);
    }

    // Get the contract's USDC balance
    function getVaultBalance() public view returns (uint256) {
        return IERC20(usdcToken).balanceOf(address(this));
    }

    // Issues a loan to the borrower after proof verification
    function lend_uncollateralized_loans(
        uint256 loanAmount,
        uint256 duration,
        Reclaim.Proof memory proof
    ) external notPaused {
        require(loans[msg.sender].amount == 0, "Active loan exists");
        require(loanAmount > 0, "Loan amount must be greater than zero");
        require(duration > 0, "Loan duration must be greater than zero");

        // Verify proof using Reclaim
        verifyProof(proof);

        // Check if the vault has enough funds
        uint256 vaultBalance = getVaultBalance();
        require(loanAmount <= vaultBalance, "Insufficient funds in the vault");

        // Calculate the due date
        uint256 dueDate = block.timestamp + duration;

        // Record the loan
        loans[msg.sender] = Loan(loanAmount, dueDate, false);

        // Transfer the loan amount to the borrower
        IERC20(usdcToken).transfer(msg.sender, loanAmount);

        emit LoanIssued(msg.sender, loanAmount, dueDate);
    }

    // Repay the loan
    function repay() external notPaused {
        Loan storage loan = loans[msg.sender];
        require(loan.amount > 0, "No active loan");
        require(!loan.repaid, "Loan already repaid");
        require(block.timestamp <= loan.dueDate, "Loan is overdue");

        // Calculate repayment amount with interest
        uint256 interest = (loan.amount * interestRate) / BASIS_POINTS;
        uint256 repaymentAmount = loan.amount + interest;

        // Transfer repayment from the borrower
        IERC20(usdcToken).transferFrom(msg.sender, address(this), repaymentAmount);

        // Mark loan as repaid
        loan.repaid = true;

        emit LoanRepaid(msg.sender, repaymentAmount);
    }

    // Check for loan defaults
    function checkForDefault(address user) external notPaused {
        Loan storage loan = loans[user];
        require(loan.amount > 0, "No active loan");
        require(!loan.repaid, "Loan already repaid");
        require(block.timestamp > loan.dueDate, "Loan not yet due");

        // Mark the loan as defaulted
        loans[user] = Loan(0, 0, false);

        emit LoanDefaulted(user);
    }

    // Withdraw funds from the vault (only owner)
    function withdraw(uint256 amount) external onlyOwner {
        uint256 vaultBalance = getVaultBalance();
        require(amount <= vaultBalance, "Insufficient funds in the vault");
        IERC20(usdcToken).transfer(owner, amount);
        emit Withdrawal(owner, amount);
    }

    // Set the interest rate (only owner)
    function setInterestRate(uint256 _interestRate) external onlyOwner {
        interestRate = _interestRate;
    }

    // Emergency pause function
    function togglePause() external onlyOwner {
        paused = !paused;
        emit EmergencyPaused(paused);
    }
}
