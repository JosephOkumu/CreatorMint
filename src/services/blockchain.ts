// Using ES module import for browser compatibility
import { ethers } from 'ethers';
import CreatorTokenABI from '../artifacts/contracts/CreatorToken.sol/CreatorToken.json';
import ArtNFTABI from '../artifacts/contracts/ArtNFT.sol/ArtNFT.json';

// Contract addresses (would come from environment variables in production)
const CREATOR_TOKEN_ADDRESS = import.meta.env.VITE_CREATOR_TOKEN_ADDRESS || '0x0';
const ART_NFT_ADDRESS = import.meta.env.VITE_ART_NFT_ADDRESS || '0x0';

// Interfaces
export interface NFT {
  tokenId: string;
  name: string;
  description: string;
  image: string;
  creator: string;
  mintedAt: Date;
}

export interface RewardEvent {
  id: string;
  creator: string;
  amount: string;
  nftTokenId: string;
  timestamp: Date;
  transactionHash: string;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
}

// Blockchain service class
class BlockchainService {
  private provider: any = null;
  private signer: any = null;
  private creatorTokenContract: any = null;
  private artNFTContract: any = null;

  // Initialize provider and signer
  public initProvider = async (): Promise<boolean> => {
    if (!window.ethereum) {
      console.error('No Ethereum provider found');
      return false;
    }

    try {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
      return true;
    } catch (error) {
      console.error('Error initializing provider:', error);
      return false;
    }
  };

  // Initialize contracts
  public initContracts = async (): Promise<boolean> => {
    if (!this.signer) {
      console.error('Signer not initialized');
      return false;
    }

    try {
      this.creatorTokenContract = new ethers.Contract(
        CREATOR_TOKEN_ADDRESS,
        CreatorTokenABI.abi,
        this.signer
      );

      this.artNFTContract = new ethers.Contract(
        ART_NFT_ADDRESS,
        ArtNFTABI.abi,
        this.signer
      );

      return true;
    } catch (error) {
      console.error('Error initializing contracts:', error);
      return false;
    }
  };

  // Connect to wallet
  public connectWallet = async (): Promise<string | null> => {
    if (!this.provider) {
      await this.initProvider();
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        await this.initContracts();
        return accounts[0];
      }
      return null;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      return null;
    }
  };

  // Get token balance
  public getTokenBalance = async (address: string): Promise<string> => {
    if (!this.creatorTokenContract) return '0';

    try {
      const balance = await this.creatorTokenContract.balanceOf(address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error('Error getting token balance:', error);
      return '0';
    }
  };

  // Mint NFT
  public mintNFT = async (
    account: string,
    metadata: NFTMetadata
  ): Promise<string | null> => {
    if (!this.artNFTContract) {
      console.error('NFT contract not initialized');
      return null;
    }

    try {
      // In a real app, this would upload to IPFS first
      // For demo purposes, we'll use a simulated IPFS URI
      const tokenURI = `ipfs://QmSimulatedHash${Date.now()}`;

      // Call the contract to mint the NFT
      const tx = await this.artNFTContract.mintNFT(account, tokenURI);
      await tx.wait();
      return tx.hash;
    } catch (error) {
      console.error('Error minting NFT:', error);
      return null;
    }
  };

  // Get all NFTs
  public getNFTs = async (): Promise<NFT[]> => {
    if (!this.artNFTContract) return [];

    try {
      const nftFilter = this.artNFTContract.filters.NFTMinted();
      const nftEvents = await this.artNFTContract.queryFilter(nftFilter);

      const nftPromises = nftEvents.map(async (event: any) => {
        const tokenId = event.args.tokenId.toString();
        const creator = event.args.creator;
        const tokenURI = event.args.tokenURI;
        const timestamp = new Date(event.args.timestamp.toNumber() * 1000);

        // Fetch metadata from IPFS
        let metadata = { name: 'Unknown', description: 'Unknown', image: '' };
        try {
          // Replace ipfs:// with https gateway for fetching
          const url = tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
          const response = await fetch(url);
          metadata = await response.json();
        } catch (error) {
          console.error(`Error fetching metadata for token ${tokenId}:`, error);
        }

        return {
          tokenId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/'),
          creator,
          mintedAt: timestamp,
        };
      });

      return await Promise.all(nftPromises);
    } catch (error) {
      console.error('Error getting NFTs:', error);
      return [];
    }
  };

  // Get all reward events
  public getRewardEvents = async (): Promise<RewardEvent[]> => {
    if (!this.creatorTokenContract) return [];

    try {
      const rewardFilter = this.creatorTokenContract.filters.CreatorRewarded();
      const rewardEvents = await this.creatorTokenContract.queryFilter(rewardFilter);

      return rewardEvents.map((event: any) => {
        const rewardId = `${event.transactionHash}-${event.logIndex}`;
        return {
          id: rewardId,
          creator: event.args.creator,
          amount: ethers.utils.formatEther(event.args.amount),
          nftTokenId: event.args.tokenId.toString(),
          timestamp: new Date(event.blockNumber * 1000), // Simplified
          transactionHash: event.transactionHash,
        };
      });
    } catch (error) {
      console.error('Error getting reward events:', error);
      return [];
    }
  };

  // Listen for account changes
  public listenToAccountChanges = (callback: (accounts: string[]) => void): void => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', callback);
    }
  };

  // Remove account change listener
  public removeAccountChangesListener = (): void => {
    if (window.ethereum) {
      window.ethereum.removeAllListeners('accountsChanged');
    }
  };
}

// Create and export an instance of the service
export const blockchainService = new BlockchainService();
export default blockchainService;
