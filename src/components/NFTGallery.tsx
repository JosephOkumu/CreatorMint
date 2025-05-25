
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Hash } from 'lucide-react';

interface NFT {
  tokenId: string;
  name: string;
  description: string;
  image: string;
  creator: string;
  mintedAt: Date;
}

interface NFTGalleryProps {
  nfts: NFT[];
}

const NFTGallery: React.FC<NFTGalleryProps> = ({ nfts }) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (nfts.length === 0) {
    return (
      <Card className="glass-effect p-8 text-center">
        <div className="text-white/60">
          <Hash className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No NFTs Yet</h3>
          <p>Be the first to mint an NFT and earn Creator Tokens!</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white flex items-center">
        <Hash className="h-6 w-6 mr-2" />
        NFT Gallery ({nfts.length})
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {nfts.map((nft) => (
          <Card key={nft.tokenId} className="glass-effect overflow-hidden hover:scale-105 transition-transform duration-200">
            <div className="aspect-square bg-gradient-to-br from-crypto-blue/20 to-crypto-purple/20 flex items-center justify-center">
              {nft.image ? (
                <img 
                  src={nft.image} 
                  alt={nft.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Hash className="h-16 w-16 text-white/40" />
              )}
            </div>
            
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold truncate">{nft.name}</h3>
                <Badge variant="secondary" className="bg-crypto-purple/20 text-crypto-purple border-crypto-purple/30">
                  #{nft.tokenId}
                </Badge>
              </div>
              
              <p className="text-white/70 text-sm line-clamp-2">{nft.description}</p>
              
              <div className="flex items-center space-x-2 pt-2 border-t border-white/10">
                <User className="h-4 w-4 text-white/60" />
                <span className="text-white/60 text-sm">Creator:</span>
                <span className="text-crypto-cyan text-sm font-mono">
                  {formatAddress(nft.creator)}
                </span>
              </div>
              
              <div className="text-white/50 text-xs">
                Minted: {nft.mintedAt.toLocaleDateString()}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NFTGallery;
