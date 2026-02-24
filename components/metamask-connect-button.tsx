'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { metaMaskConnector } from '@/lib/wagmi-config';
import { Button } from '@/components/ui/button';
import { Wallet, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export function MetaMaskConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = useState(false);
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);

  useEffect(() => {
    // Check if MetaMask is installed
    const checkMetaMask = () => {
      if (typeof window !== 'undefined') {
        const ethereum = (window as any).ethereum;
        setIsMetaMaskInstalled(!!ethereum && !!ethereum.isMetaMask);
      }
    };
    
    checkMetaMask();
    // Recheck when window loads
    window.addEventListener('load', checkMetaMask);
    return () => window.removeEventListener('load', checkMetaMask);
  }, []);

  const handleConnect = async () => {
    try {
      if (typeof window === 'undefined') return;

      const ethereum = (window as any).ethereum;
      
      // Check if MetaMask is installed
      if (!ethereum || !ethereum.isMetaMask) {
        toast.error('MetaMask is not installed. Please install MetaMask extension.');
        window.open('https://metamask.io/download/', '_blank');
        return;
      }

      // Request account access first
      await ethereum.request({ method: 'eth_requestAccounts' });
      
      // Connect using wagmi with the MetaMask connector
      connect({ connector: metaMaskConnector });
      toast.success('Connecting to MetaMask...');
    } catch (error: any) {
      console.error('Connection error:', error);
      
      if (error.code === 4001) {
        toast.error('Connection rejected by user');
      } else if (error.message?.includes('Already processing')) {
        toast.info('Please check MetaMask for pending connection request');
      } else {
        toast.error('Failed to connect MetaMask. Please try again.');
      }
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setIsOpen(false);
    toast.success('Wallet disconnected');
  };

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <div className="relative">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[#FFD600] hover:bg-[#FFD600]/90 text-black font-semibold flex items-center gap-2"
        >
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <Wallet className="w-4 h-4" />
          {shortenAddress(address)}
        </Button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg shadow-lg z-50 animate-slide-down">
            <div className="p-4 space-y-3">
              <div className="bg-[#1a1a1a] p-3 rounded text-sm">
                <p className="text-[#cccccc] text-xs mb-1">Connected Address</p>
                <p className="text-white font-mono break-all">{address}</p>
              </div>
              <Button
                onClick={handleDisconnect}
                variant="outline"
                className="w-full border-red-500/50 hover:bg-red-500/10 text-red-300"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Disconnect
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isPending}
      className="bg-[#FFD600] hover:bg-[#FFD600]/90 text-black font-semibold flex items-center gap-2"
    >
      <Wallet className="w-4 h-4" />
      {isPending ? 'Connecting...' : 'Connect MetaMask'}
    </Button>
  );
}
