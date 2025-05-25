// deploy.js - Script to deploy our smart contracts to Lisk Sepolia
const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying CreatorMint contracts...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  // Deploy CreatorToken contract
  const CreatorToken = await ethers.getContractFactory("CreatorToken");
  const creatorToken = await CreatorToken.deploy(deployer.address);
  await creatorToken.deployed();
  
  console.log(`CreatorToken deployed to: ${creatorToken.address}`);

  // Deploy ArtNFT contract
  const ArtNFT = await ethers.getContractFactory("ArtNFT");
  const artNFT = await ArtNFT.deploy(deployer.address, creatorToken.address);
  await artNFT.deployed();
  
  console.log(`ArtNFT deployed to: ${artNFT.address}`);

  // Set the NFT contract address in the CreatorToken contract
  const setNFTTx = await creatorToken.setNFTContractAddress(artNFT.address);
  await setNFTTx.wait();
  
  console.log("CreatorToken configured with ArtNFT address");

  console.log("Deployment complete!");
  
  // Return the contract addresses for verification
  return {
    CreatorToken: creatorToken.address,
    ArtNFT: artNFT.address
  };
}

main()
  .then((addresses) => {
    console.log("Contract addresses:", addresses);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
