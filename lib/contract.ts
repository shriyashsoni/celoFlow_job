import abi from '@/lib/abi.json';

export const CELO_ALFAJORES_CHAIN_ID = 44787;
export const CELO_ALFAJORES_RPC_URL = 'https://celo-alfajores.drpc.org';

// Validate contract address from environment
const getContractAddress = (): `0x${string}` => {
  const address = process.env.NEXT_PUBLIC_CELOFLOW_CONTRACT_ADDRESS;
  
  // Check if address exists
  if (!address) {
    throw new Error(
      '❌ CELOFLOW_CONTRACT_ADDRESS is not configured! ' +
      'Please set NEXT_PUBLIC_CELOFLOW_CONTRACT_ADDRESS in your .env.local file.'
    );
  }

  // Check if it's a valid hex address
  if (!address.startsWith('0x') || address.length !== 42) {
    throw new Error(
      `❌ Invalid contract address format: ${address}. ` +
      'Address must be a valid 42-character hex string starting with 0x.'
    );
  }

  // Check if it's the zero address (burn address)
  const zeroAddress = '0x0000000000000000000000000000000000000000';
  if (address.toLowerCase() === zeroAddress.toLowerCase()) {
    throw new Error(
      '❌ Contract address is set to the zero address (0x0000...)! ' +
      'This is a burn address and cannot be used. ' +
      'Please deploy your contract and update NEXT_PUBLIC_CELOFLOW_CONTRACT_ADDRESS.'
    );
  }

  return address as `0x${string}`;
};

// Export validated contract address
export const CELOFLOW_CONTRACT_ADDRESS = getContractAddress();

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
