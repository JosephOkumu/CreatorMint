import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WalletConnect from '@/components/WalletConnect';
import TokenBalance from '@/components/TokenBalance';
import NFTMintForm from '@/components/NFTMintForm';
import NFTGallery from '@/components/NFTGallery';
import RewardHistory from '@/components/RewardHistory';
import { useWeb3 } from '../hooks/useWeb3';
import { useToast } from '@/hooks/use-toast';
import { Palette, Coins, Trophy, Hash, Star, Wallet, Sparkles, Zap, Users } from 'lucide-react';

interface NFT {
  tokenId: string;
  name: string;
  description: string;
  image: string;
  creator: string;
  mintedAt: Date;
}

interface RewardEvent {
  id: string;
  creator: string;
  amount: string;
  nftTokenId: string;
  timestamp: Date;
  transactionHash: string;
}

const Index = () => {
  const { 
    account, 
    isConnected, 
    tokenBalance, 
    totalRewards, 
    nfts, 
    rewards, 
    isLoading,
    connectWallet,
    mintNFT
  } = useWeb3();
  const { toast } = useToast();

  const handleWalletConnected = async (address: string) => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive"
      });
    }
  };

  // This function has been replaced by the useWeb3 hook's loadUserData function

  const handleMintNFT = async (metadata: { name: string; description: string; image: string }) => {
    try {
      // Use the mintNFT function from the useWeb3 hook to mint the NFT on the blockchain
      const txHash = await mintNFT(metadata);
      return txHash;
    } catch (error) {
      console.error('Error minting NFT:', error);
      toast({
        title: "Minting Failed",
        description: "Failed to mint NFT. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 shadow-2xl animate-pulse">
                <Palette className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-yellow-900" />
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 mb-4 animate-fade-in">
            CreatorVerse
          </h1>
          
          <div className="max-w-3xl mx-auto">
            <p className="text-xl md:text-2xl text-gray-300 mb-6 leading-relaxed">
              Unleash your creativity in the decentralized future. 
              <span className="text-cyan-400 font-semibold"> Mint stunning NFTs</span> and 
              <span className="text-purple-400 font-semibold"> earn rewards</span> with every creation.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                <span>Instant Rewards</span>
              </div>
              <div className="flex items-center space-x-2">
                <Hash className="h-4 w-4 text-blue-400" />
                <span>Blockchain Verified</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-green-400" />
                <span>Creator Community</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-2xl blur-lg opacity-30"></div>
            <div className="relative">
              <WalletConnect 
                onWalletConnected={handleWalletConnected}
                connectedAddress={account}
              />
            </div>
          </div>
        </div>

        {isConnected && (
          <>
            <div className="mb-12 animate-scale-in">
              <TokenBalance balance={tokenBalance} totalRewards={totalRewards} />
            </div>

            <div className="space-y-8">
              <Tabs defaultValue="home" className="space-y-8">
                <div className="flex justify-center">
                  <TabsList className="grid w-full max-w-2xl grid-cols-4 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 shadow-2xl">
                    <TabsTrigger 
                      value="home" 
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-cyan-500 text-white rounded-xl transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:scale-105"
                    >
                      <Star className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Home</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="mint" 
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-purple-500 text-white rounded-xl transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:scale-105"
                    >
                      <Coins className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Create</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="gallery" 
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-blue-500 text-white rounded-xl transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:scale-105"
                    >
                      <Hash className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Gallery</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="rewards" 
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-600 data-[state=active]:to-pink-500 text-white rounded-xl transition-all duration-300 data-[state=active]:shadow-lg data-[state=active]:scale-105"
                    >
                      <Trophy className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Rewards</span>
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="mint" className="animate-fade-in">
                  <NFTMintForm onMint={handleMintNFT} isConnected={isConnected} />
                </TabsContent>

                <TabsContent value="gallery" className="animate-fade-in">
                  <NFTGallery nfts={nfts} />
                </TabsContent>

                <TabsContent value="rewards" className="animate-fade-in">
                  <RewardHistory rewards={rewards} />
                </TabsContent>

                <TabsContent value="home" className="animate-fade-in">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                      <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                        <div className="flex items-center mb-6">
                          <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl mr-4">
                            <Zap className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-white">How It Works</h3>
                        </div>
                        
                        <div className="space-y-6">
                          {[
                            { step: "1", text: "Connect your MetaMask wallet securely", color: "from-purple-500 to-purple-600" },
                            { step: "2", text: "Upload artwork and create stunning NFTs", color: "from-blue-500 to-blue-600" },
                            { step: "3", text: "Earn Creator Tokens (CT) instantly", color: "from-pink-500 to-pink-600" },
                            { step: "4", text: "Build your collection and grow rewards", color: "from-cyan-500 to-cyan-600" }
                          ].map((item, index) => (
                            <div key={index} className="flex items-center space-x-4 group/item">
                              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-white font-bold shadow-lg group-hover/item:scale-110 transition-transform duration-200`}>
                                {item.step}
                              </div>
                              <p className="text-gray-300 group-hover/item:text-white transition-colors duration-200">{item.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
                      <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
                        <div className="flex items-center mb-6">
                          <div className="p-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl mr-4">
                            <Hash className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-white">Blockchain Features</h3>
                        </div>
                        
                        <div className="space-y-6">
                          {[
                            { icon: Hash, text: "ERC721 NFT Collection (ArtNFT)", color: "text-purple-400" },
                            { icon: Coins, text: "ERC20 Creator Token (CT)", color: "text-blue-400" },
                            { icon: Trophy, text: "Automatic reward distribution", color: "text-pink-400" },
                            { icon: Star, text: "IPFS decentralized storage", color: "text-cyan-400" }
                          ].map((item, index) => (
                            <div key={index} className="flex items-center space-x-4 group/item">
                              <div className="p-2 bg-slate-700/50 rounded-lg group-hover/item:bg-slate-600/50 transition-colors duration-200">
                                <item.icon className={`h-5 w-5 ${item.color}`} />
                              </div>
                              <p className="text-gray-300 group-hover/item:text-white transition-colors duration-200">{item.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}

        {!isConnected && (
          <div className="text-center py-24 animate-fade-in">
            <div className="max-w-md mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-12 shadow-2xl">
                <div className="mb-8">
                  <div className="relative inline-block">
                    <Wallet className="h-20 w-20 text-gray-400 mx-auto animate-pulse" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-4">
                  Welcome to the Future
                </h2>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  Connect your wallet to enter the ultimate NFT creation platform and start earning Creator Tokens today!
                </p>
                
                <div className="flex justify-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Decentralized</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Rewarding</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
