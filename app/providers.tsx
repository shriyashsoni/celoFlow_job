'use client';

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { WagmiProvider, http } from 'wagmi';
import { defineChain } from 'viem';
import { CELO_ALFAJORES_CHAIN_ID, CELO_ALFAJORES_RPC_URL } from '@/lib/contract';

const celoAlfajores = defineChain({
  id: CELO_ALFAJORES_CHAIN_ID,
  name: 'Celo Alfajores',
  nativeCurrency: {
    name: 'Celo',
    symbol: 'CELO',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [CELO_ALFAJORES_RPC_URL],
    },
    public: {
      http: [CELO_ALFAJORES_RPC_URL],
    },
  },
  blockExplorers: {
    default: {
      name: 'Celo Explorer',
      url: 'https://alfajores.celoscan.io',
    },
  },
  testnet: true,
});

export const wagmiConfig = getDefaultConfig({
  appName: 'CeloFlow',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'celo-flow',
  chains: [celoAlfajores],
  transports: {
    [celoAlfajores.id]: http(CELO_ALFAJORES_RPC_URL),
  },
  ssr: true,
});

const queryClient = new QueryClient();

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: '#FFD600',
            accentColorForeground: '#000000',
            overlayBlur: 'small',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
