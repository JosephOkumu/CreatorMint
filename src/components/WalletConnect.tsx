
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Wallet, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WalletConnectProps {
  onWalletConnected: (address: string) => void;
  connectedAddress: string | null;
}

const WalletConnect: React.FC<WalletConnectProps> = ({ onWalletConnected, connectedAddress }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to use this application",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts.length > 0) {
        // Call the parent's onWalletConnected function with the connected address
        onWalletConnected(accounts[0]);
        toast({
          title: "Wallet Connected",
          description: "Successfully connected to MetaMask"
        });
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to MetaMask",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const copyAddress = async () => {
    if (connectedAddress) {
      await navigator.clipboard.writeText(connectedAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard"
      });
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (connectedAddress) {
    return (
      <Card className="glass-effect p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wallet className="h-5 w-5 text-crypto-purple" />
            <span className="text-white font-medium">
              {formatAddress(connectedAddress)}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyAddress}
            className="text-white hover:bg-white/20"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Button 
      onClick={connectWallet}
      disabled={isConnecting}
      className="bg-crypto-purple hover:bg-crypto-violet text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
    >
      <Wallet className="h-5 w-5 mr-2" />
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </Button>
  );
};

export default WalletConnect;
