// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CreatorToken.sol";

/**
 * @title ArtNFT
 * @dev ERC721 token representing digital artworks in the CreatorMint platform
 */
contract ArtNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    // Track token IDs
    Counters.Counter private _tokenIds;
    
    // Reference to the CreatorToken contract
    CreatorToken public creatorToken;
    
    // Mapping from token ID to creator address
    mapping(uint256 => address) public creators;
    
    // Event emitted when a new NFT is minted
    event NFTMinted(
        uint256 indexed tokenId, 
        address indexed creator, 
        string tokenURI, 
        uint256 timestamp
    );

    /**
     * @dev Constructor that initializes the NFT collection
     * @param initialOwner The address that will own the contract
     * @param _creatorTokenAddress The address of the CreatorToken contract
     */
    constructor(
        address initialOwner,
        address _creatorTokenAddress
    ) ERC721("ArtNFT", "ANFT") Ownable(initialOwner) {
        creatorToken = CreatorToken(_creatorTokenAddress);
    }

    /**
     * @dev Updates the CreatorToken contract address
     * @param _creatorTokenAddress The new address of the CreatorToken contract
     */
    function setCreatorTokenAddress(address _creatorTokenAddress) external onlyOwner {
        creatorToken = CreatorToken(_creatorTokenAddress);
    }

    /**
     * @dev Mints a new NFT token
     * @param recipient The address that will receive the NFT
     * @param tokenURI The URI containing the metadata for the NFT
     * @return The ID of the newly minted token
     */
    function mintNFT(address recipient, string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        // Mint the NFT
        _mint(recipient, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        // Store the creator
        creators[newTokenId] = msg.sender;
        
        // Reward the creator with tokens
        creatorToken.rewardCreator(msg.sender, newTokenId);
        
        // Emit event
        emit NFTMinted(newTokenId, msg.sender, tokenURI, block.timestamp);
        
        return newTokenId;
    }

    /**
     * @dev Returns the creator of a token
     * @param tokenId The ID of the token
     * @return The address of the creator
     */
    function getCreator(uint256 tokenId) external view returns (address) {
        require(_exists(tokenId), "Token does not exist");
        return creators[tokenId];
    }

    /**
     * @dev Checks if a token exists
     * @param tokenId The ID of the token
     * @return Whether the token exists
     */
    function _exists(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }
}
