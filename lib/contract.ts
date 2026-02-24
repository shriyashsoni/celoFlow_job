import abi from '@/lib/abi.json';

export const CELO_ALFAJORES_CHAIN_ID = 44787;
export const CELO_ALFAJORES_RPC_URL = 'https://celo-alfajores.drpc.org';

export const CELOFLOW_CONTRACT_ADDRESS =
  (process.env.NEXT_PUBLIC_CELOFLOW_CONTRACT_ADDRESS as `0x${string}` | undefined) ??
  ('0x0000000000000000000000000000000000000000' as const);

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
