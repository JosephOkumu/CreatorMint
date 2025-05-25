# CreatorVerse

A dApp platform where users can mint and collect NFTs representing digital artworks, with creators earning ERC20 tokens as rewards every time someone mints their NFT. Built on Lisk Sepolia with React, TypeScript, and Ethers.js.

## Features

- 🖼️ **NFT Creation & Collection**: Mint ERC721 tokens representing digital artworks
- 💰 **Creator Rewards**: Creators automatically earn ERC20 tokens when their NFTs are minted
- 🔗 **MetaMask Integration**: Seamless wallet connection and blockchain interaction
- 🌐 **IPFS Storage**: Decentralized storage for NFT metadata and images
- 📊 **Token Dashboard**: Track balances and reward history
- 🎭 **Modern UI**: Beautiful, responsive interface with shadcn/ui components

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Blockchain**: Solidity, Hardhat, Ethers.js
- **Storage**: IPFS via NFT.Storage
- **Network**: Lisk Sepolia (Ethereum Layer 2)

## Smart Contracts

- **CreatorToken (ERC20)**: Reward token minted to creators when their NFTs are collected
- **ArtNFT (ERC721)**: NFT collection representing digital artworks

## Setup & Installation

### Prerequisites

- Node.js v16+
- MetaMask wallet extension
- NFT.Storage API key (for IPFS uploads)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/CreatorMint.git
   cd CreatorMint
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create .env file (copy from .env.example)
   ```bash
   cp .env.example .env
   ```

4. Add your environment variables to .env
   - `VITE_NFT_STORAGE_API_KEY`: Your NFT.Storage API key
   - `PRIVATE_KEY`: Your wallet private key (for contract deployment)
   - `VITE_CREATOR_TOKEN_ADDRESS`: Deployed CreatorToken contract address
   - `VITE_ART_NFT_ADDRESS`: Deployed ArtNFT contract address

### Compile and Deploy Smart Contracts

1. Compile contracts
   ```bash
   npm run compile
   ```

2. Deploy to Lisk Sepolia
   ```bash
   npm run deploy:lisk
   ```
   
3. Update your .env with the deployed contract addresses

### Start Development Server

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

## Usage

1. Connect your MetaMask wallet
2. Create a new NFT by uploading an image and providing metadata
3. View your NFT collection in the Gallery
4. Track your CreatorToken rewards in the Rewards section

## License

MIT
