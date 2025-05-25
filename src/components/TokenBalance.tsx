
import React from 'react';
import { Card } from '@/components/ui/card';
import { Coins, Trophy } from 'lucide-react';

interface TokenBalanceProps {
  balance: string;
  totalRewards: string;
}

const TokenBalance: React.FC<TokenBalanceProps> = ({ balance, totalRewards }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="glass-effect p-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-full bg-crypto-blue/20">
            <Coins className="h-6 w-6 text-crypto-blue" />
          </div>
          <div>
            <p className="text-white/80 text-sm">Creator Token Balance</p>
            <p className="text-white text-2xl font-bold">{balance} CT</p>
          </div>
        </div>
      </Card>
      
      <Card className="glass-effect p-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-full bg-crypto-pink/20">
            <Trophy className="h-6 w-6 text-crypto-pink" />
          </div>
          <div>
            <p className="text-white/80 text-sm">Total Rewards Earned</p>
            <p className="text-white text-2xl font-bold">{totalRewards} CT</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TokenBalance;
