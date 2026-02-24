import abi from '@/lib/abi.json';

export const CELO_SEPOLIA_CHAIN_ID = 11142220;
export const CELO_SEPOLIA_RPC_URL = 'https://forno.celo-sepolia.celo-testnet.org';

export const CELO_ALFAJORES_CHAIN_ID = CELO_SEPOLIA_CHAIN_ID;
export const CELO_ALFAJORES_RPC_URL = CELO_SEPOLIA_RPC_URL;

export const CELOFLOW_CONTRACT_ADDRESS =
  ((process.env.NEXT_PUBLIC_CELOFLOW_CONTRACT_ADDRESS ||
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) as `0x${string}` | undefined) ??
  ('0x24bE9C74CFCA5313f388c87106cb7B4a41A8F3c9' as const);

export const CELOFLOW_ABI = abi;

export type CeloFlowStream = {
  id: bigint;
  employer: `0x${string}`;
  employee: `0x${string}`;
  totalAmount: bigint;
  startTime: bigint;
  duration: bigint;
  withdrawnAmount: bigint;
  isActive: boolean;
  available: bigint;
};
