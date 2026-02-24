'use client';

import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export function MetaMaskDebug() {
  const [debugInfo, setDebugInfo] = useState({
    hasWindow: false,
    hasEthereum: false,
    isMetaMask: false,
    provider: '',
    accounts: 0,
  });

  useEffect(() => {
    const checkMetaMask = async () => {
      const info = {
        hasWindow: typeof window !== 'undefined',
        hasEthereum: false,
        isMetaMask: false,
        provider: 'None',
        accounts: 0,
      };

      if (typeof window !== 'undefined') {
        const ethereum = (window as any).ethereum;
        
        if (ethereum) {
          info.hasEthereum = true;
          info.isMetaMask = !!ethereum.isMetaMask;
          
          if (ethereum.providers) {
            const metaMaskProvider = ethereum.providers.find((p: any) => p.isMetaMask);
            info.provider = metaMaskProvider ? 'MetaMask (Multi-provider)' : 'Other provider';
          } else {
            info.provider = ethereum.isMetaMask ? 'MetaMask' : 'Other provider';
          }

          try {
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            info.accounts = accounts.length;
          } catch (e) {
            info.accounts = 0;
          }
        }
      }

      setDebugInfo(info);
    };

    checkMetaMask();
    
    // Listen for MetaMask events
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const ethereum = (window as any).ethereum;
      
      const handleAccountsChanged = () => {
        checkMetaMask();
      };
      
      ethereum.on?.('accountsChanged', handleAccountsChanged);
      
      return () => {
        ethereum.removeListener?.('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  return (
    <Alert className="my-4 bg-[#1a1a1a] border-[#333]">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>MetaMask Detection Debug</AlertTitle>
      <AlertDescription>
        <div className="mt-2 space-y-1 text-xs font-mono">
          <div className="flex items-center gap-2">
            {debugInfo.hasWindow ? (
              <CheckCircle className="w-3 h-3 text-green-500" />
            ) : (
              <XCircle className="w-3 h-3 text-red-500" />
            )}
            <span>Window: {debugInfo.hasWindow ? 'Available' : 'Not Available'}</span>
          </div>
          <div className="flex items-center gap-2">
            {debugInfo.hasEthereum ? (
              <CheckCircle className="w-3 h-3 text-green-500" />
            ) : (
              <XCircle className="w-3 h-3 text-red-500" />
            )}
            <span>window.ethereum: {debugInfo.hasEthereum ? 'Available' : 'Not Available'}</span>
          </div>
          <div className="flex items-center gap-2">
            {debugInfo.isMetaMask ? (
              <CheckCircle className="w-3 h-3 text-green-500" />
            ) : (
              <XCircle className="w-3 h-3 text-red-500" />
            )}
            <span>isMetaMask: {debugInfo.isMetaMask ? 'True' : 'False'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Provider: {debugInfo.provider}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Connected Accounts: {debugInfo.accounts}</span>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}
