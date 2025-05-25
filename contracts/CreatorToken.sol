// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CreatorToken
 * @dev ERC20 token used to reward NFT creators in the CreatorMint platform
 */
contract CreatorToken is ERC20, Ownable {
    // Event emitted when a creator is rewarded
    event CreatorRewarded(address indexed creator, uint256 amount, uint256 tokenId);
    
    // Initial token supply - 1 million tokens with 18 decimals
    uint256 private constant INITIAL_SUPPLY = 1_000_000 * 10**18;
    
    // Default reward amount for minting an NFT - 10 tokens
    uint256 public rewardAmount = 10 * 10**18;
    
    // NFT contract address that's allowed to call rewardCreator
    address public nftContractAddress;

    /**
     * @dev Constructor that initializes the token and mints the initial supply
     * @param initialOwner The address that will own the contract and receive initial tokens
     */
    constructor(address initialOwner) ERC20("CreatorToken", "CT") Ownable(initialOwner) {
        _mint(initialOwner, INITIAL_SUPPLY);
    }

    /**
     * @dev Sets the NFT contract address
     * @param _nftContractAddress The address of the NFT contract
     */
    function setNFTContractAddress(address _nftContractAddress) external onlyOwner {
        nftContractAddress = _nftContractAddress;
    }

    /**
     * @dev Sets the reward amount for minting an NFT
     * @param _rewardAmount The new reward amount
     */
    function setRewardAmount(uint256 _rewardAmount) external onlyOwner {
        rewardAmount = _rewardAmount;
    }

    /**
     * @dev Rewards a creator for minting an NFT
     * @param to The address of the creator to reward
     * @param tokenId The ID of the NFT that was minted
     */
    function rewardCreator(address to, uint256 tokenId) external returns (bool) {
        // Only the NFT contract can call this function
        require(msg.sender == nftContractAddress, "Only NFT contract can reward creators");
        
        // Transfer tokens to the creator
        _mint(to, rewardAmount);
        
        // Emit event
        emit CreatorRewarded(to, rewardAmount, tokenId);
        
        return true;
    }
}
