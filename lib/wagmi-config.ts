import { http } from 'wagmi';
import { metaMask } from 'wagmi/connectors';
import { defineChain } from 'viem';
import { createConfig } from 'wagmi';

export const CELO_ALFAJORES_CHAIN_ID = 44787;
export const CELO_ALFAJORES_RPC_URL = 'https://celo-alfajores.drpc.org';

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

export const metaMaskConnector = metaMask();

export const wagmiConfig = createConfig({
  chains: [celoAlfajores],
  connectors: [metaMaskConnector],
  transports: {
    [celoAlfajores.id]: http(CELO_ALFAJORES_RPC_URL),
  },
  ssr: true,
});
