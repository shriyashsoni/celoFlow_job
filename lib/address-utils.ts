import { isAddress } from 'viem';

/**
 * Common burn addresses on Ethereum-compatible chains
 * These addresses are used to permanently destroy tokens
 */
export const BURN_ADDRESSES = [
  '0x0000000000000000000000000000000000000000', // Zero address
  '0x000000000000000000000000000000000000dead', // Dead address (lowercase)
  '0x000000000000000000000000000000000000dEaD', // Dead address (mixed case)
] as const;

/**
 * Check if an address is a known burn address
 * @param address - The wallet address to check
 * @returns true if the address is a burn address, false otherwise
 */
export function isBurnAddress(address: string): boolean {
  if (!address || !isAddress(address)) {
    return false;
  }
  
  const normalized = address.toLowerCase();
  return BURN_ADDRESSES.some(burn => burn.toLowerCase() === normalized);
}

/**
 * Validate if an address is safe to send funds to
 * @param address - The wallet address to validate
 * @returns object with isValid boolean and error message if invalid
 */
export function validateRecipientAddress(address: string): {
  isValid: boolean;
  error?: string;
} {
  if (!address) {
    return { isValid: false, error: 'Address is required' };
  }

  if (!isAddress(address)) {
    return { isValid: false, error: 'Invalid wallet address format' };
  }

  if (isBurnAddress(address)) {
    return {
      isValid: false,
      error: 'This is a burn address. Sending funds here will permanently destroy them.',
    };
  }

  return { isValid: true };
}

/**
 * Shorten a wallet address for display
 * @param address - The full wallet address
 * @param startChars - Number of characters to show at start (default: 6)
 * @param endChars - Number of characters to show at end (default: 4)
 * @returns Shortened address like "0x1234...5678"
 */
export function shortenAddress(
  address: string,
  startChars: number = 6,
  endChars: number = 4
): string {
  if (!address || address.length < startChars + endChars) {
    return address;
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}
