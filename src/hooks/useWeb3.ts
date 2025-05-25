
import { useState, useEffect } from 'react';
import blockchainService, { NFT, RewardEvent, NFTMetadata } from '../services/blockchain';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const useWeb3 = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [tokenBalance, setTokenBalance] = useState('0');
  const [totalRewards, setTotalRewards] = useState('0');
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [rewards, setRewards] = useState<RewardEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Connect wallet function
  const connectWallet = async () => {
    setIsLoading(true);
    try {
      // Initialize blockchain service and connect wallet
      await blockchainService.initProvider();
      const connectedAccount = await blockchainService.connectWallet();
      
      if (connectedAccount) {
        setAccount(connectedAccount);
        setIsConnected(true);
        await loadUserData(connectedAccount);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load user data (balances, NFTs, rewards)
  const loadUserData = async (walletAddress?: string) => {
    const addressToUse = walletAddress || account;
    if (!addressToUse || !isConnected) return;
    
    setIsLoading(true);
    try {
      // Get token balance
      const balance = await blockchainService.getTokenBalance(addressToUse);
      setTokenBalance(balance);
      setTotalRewards(balance); // For demo purposes, using balance as total rewards
      
      // Get NFTs
      const nftData = await blockchainService.getNFTs();
      setNfts(nftData);
      
      // Get reward events
      const rewardData = await blockchainService.getRewardEvents();
      setRewards(rewardData);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mint NFT function
  const mintNFT = async (metadata: NFTMetadata) => {
    if (!isConnected || !account) {
      throw new Error('Wallet not connected');
    }
    
    setIsLoading(true);
    try {
      const txHash = await blockchainService.mintNFT(account, metadata);
      
      if (txHash) {
        // Reload user data after successful mint
        await loadUserData();
        return txHash;
      } else {
        throw new Error('Transaction failed');
      }
    } catch (error) {
      console.error('Error minting NFT:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Set up connection listeners
  useEffect(() => {
    // Check if user is already connected
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            await blockchainService.initProvider();
            await blockchainService.initContracts();
            setAccount(accounts[0]);
            setIsConnected(true);
            await loadUserData(accounts[0]);
          }
        } catch (error) {
          console.error('Error checking connection:', error);
        }
      }
    };
    
    checkConnection();
    
    // Listen for account changes
    blockchainService.listenToAccountChanges(async (accounts: string[]) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        await loadUserData(accounts[0]);
      } else {
        setAccount(null);
        setIsConnected(false);
        setTokenBalance('0');
        setTotalRewards('0');
        setNfts([]);
        setRewards([]);
      }
    });
    
    return () => {
      blockchainService.removeAccountChangesListener();
    };
  }, []);

  return {
    account,
    isConnected,
    setAccount,
    setIsConnected,
    tokenBalance,
    totalRewards,
    nfts,
    rewards,
    isLoading,
    connectWallet,
    loadUserData,
    mintNFT
  };
};
