import { CELOFLOW_CONTRACT_ADDRESS, CELOFLOW_ABI } from './contract';

/**
 * Validate the CeloFlow contract configuration
 * Throws an error if the contract is not properly configured
 */
export function validateContractConfig(): {
  isValid: boolean;
  address: `0x${string}`;
  warnings: string[];
  errors: string[];
} {
  const warnings: string[] = [];
  const errors: string[] = [];
  let isValid = true;

  // Check contract address
  if (!CELOFLOW_CONTRACT_ADDRESS) {
    errors.push('Contract address is not configured');
    isValid = false;
  } else {
    // Check if it's a valid Ethereum address format
    if (!CELOFLOW_CONTRACT_ADDRESS.match(/^0x[a-fA-F0-9]{40}$/)) {
      errors.push('Contract address is not a valid Ethereum address');
      isValid = false;
    }

    // Check for zero address
    if (CELOFLOW_CONTRACT_ADDRESS.toLowerCase() === '0x0000000000000000000000000000000000000000') {
      errors.push('Contract address is the zero address (burn address)');
      isValid = false;
    }

    // Check for common test/placeholder addresses
    const testAddresses = [
      '0x0000000000000000000000000000000000000000',
      '0x000000000000000000000000000000000000dead',
      '0x1111111111111111111111111111111111111111',
    ];
    
    if (testAddresses.some(test => test.toLowerCase() === CELOFLOW_CONTRACT_ADDRESS.toLowerCase())) {
      warnings.push('Contract address appears to be a test/placeholder address');
    }
  }

  // Check if ABI is loaded
  if (!CELOFLOW_ABI || !Array.isArray(CELOFLOW_ABI) || CELOFLOW_ABI.length === 0) {
    errors.push('Contract ABI is not loaded or empty');
    isValid = false;
  } else {
    // Validate required functions exist in ABI
    const requiredFunctions = ['createStream', 'withdraw', 'cancelStream', 'getAvailableBalance'];
    const abiFunctionNames = CELOFLOW_ABI
      .filter((item: any) => item.type === 'function')
      .map((item: any) => item.name);

    const missingFunctions = requiredFunctions.filter(fn => !abiFunctionNames.includes(fn));
    if (missingFunctions.length > 0) {
      warnings.push(`ABI may be incomplete. Missing functions: ${missingFunctions.join(', ')}`);
    }
  }

  return {
    isValid,
    address: CELOFLOW_CONTRACT_ADDRESS,
    warnings,
    errors,
  };
}

/**
 * Get contract configuration status for display
 */
export function getContractStatus() {
  try {
    const validation = validateContractConfig();
    
    return {
      configured: validation.isValid,
      address: validation.address,
      displayAddress: `${validation.address.slice(0, 6)}...${validation.address.slice(-4)}`,
      warnings: validation.warnings,
      errors: validation.errors,
      network: 'Celo Alfajores',
      chainId: 44787,
    };
  } catch (error) {
    return {
      configured: false,
      address: null,
      displayAddress: 'Not Configured',
      warnings: [],
      errors: [error instanceof Error ? error.message : 'Unknown configuration error'],
      network: 'Celo Alfajores',
      chainId: 44787,
    };
  }
}

/**
 * Log contract configuration to console (useful for debugging)
 */
export function logContractConfig() {
  const status = getContractStatus();
  
  console.group('🔧 CeloFlow Contract Configuration');
  console.log('Network:', status.network);
  console.log('Chain ID:', status.chainId);
  console.log('Contract Address:', status.address || 'NOT CONFIGURED');
  
  if (status.configured) {
    console.log('✅ Status: Properly Configured');
  } else {
    console.log('❌ Status: Configuration Error');
  }
  
  if (status.errors.length > 0) {
    console.group('❌ Errors:');
    status.errors.forEach(err => console.error(err));
    console.groupEnd();
  }
  
  if (status.warnings.length > 0) {
    console.group('⚠️ Warnings:');
    status.warnings.forEach(warn => console.warn(warn));
    console.groupEnd();
  }
  
  console.groupEnd();
  
  return status;
}
