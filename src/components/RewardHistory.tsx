
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Clock, User } from 'lucide-react';

interface RewardEvent {
  id: string;
  creator: string;
  amount: string;
  nftTokenId: string;
  timestamp: Date;
  transactionHash: string;
}

interface RewardHistoryProps {
  rewards: RewardEvent[];
}

const RewardHistory: React.FC<RewardHistoryProps> = ({ rewards }) => {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (rewards.length === 0) {
    return (
      <Card className="glass-effect p-8 text-center">
        <div className="text-white/60">
          <Trophy className="h-12 w-12 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Rewards Yet</h3>
          <p>Rewards will appear here when NFTs are minted!</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-effect p-6">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <Trophy className="h-6 w-6 mr-2" />
        Creator Rewards History
      </h2>
      
      <div className="space-y-4">
        {rewards.map((reward) => (
          <div key={reward.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center space-x-4">
              <div className="p-2 rounded-full bg-crypto-pink/20">
                <Trophy className="h-5 w-5 text-crypto-pink" />
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-white/60" />
                  <span className="text-white font-mono text-sm">
                    {formatAddress(reward.creator)}
                  </span>
                  <Badge variant="outline" className="border-crypto-purple/30 text-crypto-purple">
                    NFT #{reward.nftTokenId}
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="h-4 w-4 text-white/60" />
                  <span className="text-white/60 text-sm">
                    {reward.timestamp.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-crypto-cyan font-bold text-lg">
                +{reward.amount} CT
              </div>
              <a 
                href={`https://sepolia.etherscan.io/tx/${reward.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white text-xs underline"
              >
                View Transaction
              </a>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RewardHistory;
