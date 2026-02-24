'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { AlertCircle, Wallet, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function WalletDetector() {
  const { isConnected, address } = useAccount();
  const [hasMetaMask, setHasMetaMask] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && window.ethereum) {
      setHasMetaMask(true);
    }
  }, []);

  if (!mounted) return null;

  if (!isConnected) {
    if (!hasMetaMask) {
      return (
        <Card className="border border-orange-500/40 bg-orange-500/10 mb-4 animate-pulse">
          <CardContent className="pt-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0" />
            <div className="text-sm text-orange-200">
              <p className="font-semibold">MetaMask or Web3 Wallet Required</p>
              <p className="text-xs mt-1">Install MetaMask browser extension to use CeloFlow</p>
            </div>
          </CardContent>
        </Card>
      );
    }
    return null;
  }

  return (
    <Card className="border border-green-500/40 bg-green-500/10 mb-4 animate-in fade-in slide-in-from-top">
      <CardContent className="pt-6 flex items-center gap-3">
        <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
        <div className="text-sm text-green-200">
          <p className="font-semibold flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Wallet Connected
          </p>
          <p className="text-xs mt-1 font-mono">{address}</p>
        </div>
      </CardContent>
    </Card>
  );
}
