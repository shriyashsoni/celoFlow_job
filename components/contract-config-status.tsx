'use client';

import { useEffect, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { getContractStatus } from '@/lib/contract-validation';

export function ContractConfigStatus() {
  const [status, setStatus] = useState<ReturnType<typeof getContractStatus> | null>(null);

  useEffect(() => {
    try {
      const config = getContractStatus();
      setStatus(config);
      
      // Log to console for debugging
      if (config.errors.length > 0 || config.warnings.length > 0) {
        console.group('🔧 Contract Configuration Status');
        if (config.errors.length > 0) {
          console.error('Errors:', config.errors);
        }
        if (config.warnings.length > 0) {
          console.warn('Warnings:', config.warnings);
        }
        console.groupEnd();
      }
    } catch (error) {
      console.error('Failed to get contract status:', error);
      setStatus({
        configured: false,
        address: null,
        displayAddress: 'Error',
        warnings: [],
        errors: [error instanceof Error ? error.message : 'Unknown error'],
        network: 'Celo Alfajores',
        chainId: 44787,
      });
    }
  }, []);

  if (!status) {
    return null;
  }

  // If configured and no errors, show success
  if (status.configured && status.errors.length === 0 && status.warnings.length === 0) {
    return (
      <Alert className="bg-green-500/10 border-green-500/30">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertTitle className="text-green-400">✅ Contract Connected</AlertTitle>
        <AlertDescription className="text-green-200 text-xs">
          <div className="space-y-1 mt-2">
            <div className="flex items-center justify-between">
              <span>Network:</span>
              <span className="font-mono font-semibold">{status.network}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Contract:</span>
              <a
                href={`https://alfajores.celoscan.io/address/${status.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono font-semibold hover:text-green-300 flex items-center gap-1"
              >
                {status.displayAddress}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // If there are errors
  if (status.errors.length > 0) {
    return (
      <Alert className="bg-red-500/10 border-red-500/30">
        <XCircle className="h-4 w-4 text-red-500" />
        <AlertTitle className="text-red-400">❌ Contract Configuration Error</AlertTitle>
        <AlertDescription className="text-red-200 text-xs">
          <div className="mt-2 space-y-1">
            {status.errors.map((error, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-red-400">•</span>
                <span>{error}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 p-2 bg-red-500/20 rounded text-xs">
            <strong>Fix:</strong> Update <code className="bg-black/30 px-1 rounded">NEXT_PUBLIC_CELOFLOW_CONTRACT_ADDRESS</code> in your{' '}
            <code className="bg-black/30 px-1 rounded">.env.local</code> file with your deployed contract address.
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // If there are warnings only
  if (status.warnings.length > 0) {
    return (
      <Alert className="bg-yellow-500/10 border-yellow-500/30">
        <AlertCircle className="h-4 w-4 text-yellow-500" />
        <AlertTitle className="text-yellow-400">⚠️ Contract Configuration Warnings</AlertTitle>
        <AlertDescription className="text-yellow-200 text-xs">
          <div className="mt-2 space-y-1">
            {status.warnings.map((warning, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-yellow-400">•</span>
                <span>{warning}</span>
              </div>
            ))}
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
