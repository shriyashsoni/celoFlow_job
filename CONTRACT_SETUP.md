# Contract Configuration Guide

## Overview

CeloFlow requires proper contract configuration to function. This guide explains how to set up and validate your contract addresses.

## Quick Setup

### 1. Set Environment Variable

Create or update `.env.local` in your project root:

```bash
# Required: Your deployed CeloFlow contract address
NEXT_PUBLIC_CELOFLOW_CONTRACT_ADDRESS=0xYourActualContractAddress
```

**Example:**
```bash
NEXT_PUBLIC_CELOFLOW_CONTRACT_ADDRESS=0xD7840983B638cFcf9fC0CD32b358B02eb43E59Ef
```

### 2. Verify Configuration

The app will automatically validate your contract configuration on startup. Check the dashboard for:
- ✅ Green banner: Contract configured correctly
- ⚠️ Yellow banner: Configuration warnings
- ❌ Red banner: Configuration errors

## Configuration Files

### Main Files

1. **`.env.local`** (Git-ignored, your local config)
   - Contains your actual contract address
   - Not committed to version control
   - Required for the app to run

2. **`.env.example`** (Template file)
   - Shows the format of required variables
   - Safe to commit to Git
   - Copy this to `.env.local` and update values

3. **`lib/contract.ts`** (Contract configuration)
   - Imports and validates the contract address
   - Exports contract ABI and configuration
   - Throws errors if misconfigured

4. **`lib/contract-validation.ts`** (Validation utilities)
   - Validates contract address format
   - Checks for burn/test addresses
   - Provides configuration status

## Validation Rules

The contract address **MUST**:
- ✅ Be a valid Ethereum address (42 characters, starts with `0x`)
- ✅ Not be the zero address (`0x0000...0000`)
- ✅ Not be a burn address (`0x...dEaD`)
- ✅ Be properly deployed on Celo Alfajores

## Common Issues & Solutions

### ❌ Error: Contract address is not configured

**Problem:** `NEXT_PUBLIC_CELOFLOW_CONTRACT_ADDRESS` is not set in `.env.local`

**Solution:**
```bash
# Create .env.local and add:
NEXT_PUBLIC_CELOFLOW_CONTRACT_ADDRESS=0xYourContractAddress
```

### ❌ Error: Contract address is the zero address

**Problem:** Using placeholder/burn address `0x0000000000000000000000000000000000000000`

**Solution:** Deploy your contract and use the actual deployed address

### ❌ Error: Invalid contract address format

**Problem:** Address is malformed or incorrect length

**Solution:** Ensure address is exactly 42 characters and starts with `0x`

### ⚠️ Warning: Missing functions in ABI

**Problem:** Contract ABI may be outdated or incomplete

**Solution:** Update `lib/abi.json` with the latest contract ABI from your deployment

## Deployment Workflow

### Step 1: Deploy Contract

```bash
cd celo-smart-contract
npm run deploy
```

This will:
- Deploy CeloFlow.sol to Celo Alfajores
- Output the contract address
- Update `.env.local` automatically

### Step 2: Verify Deployment

Check the contract on [Alfajores Block Explorer](https://alfajores.celoscan.io/):
```
https://alfajores.celoscan.io/address/YOUR_CONTRACT_ADDRESS
```

### Step 3: Update Frontend

If deployment script didn't update `.env.local`:

```bash
# In project root, create/update .env.local
echo "NEXT_PUBLIC_CELOFLOW_CONTRACT_ADDRESS=0xYourDeployedAddress" > .env.local
```

### Step 4: Restart Development Server

```bash
npm run dev
```

## Checking Configuration Status

### In Browser

Visit any dashboard page - you'll see a status banner at the top:
- **Green banner**: ✅ Contract configured and ready
- **Yellow banner**: ⚠️ Warnings (check console)
- **Red banner**: ❌ Configuration error

### In Code

```typescript
import { getContractStatus, logContractConfig } from '@/lib/contract-validation';

// Get status object
const status = getContractStatus();
console.log(status);

// Log formatted configuration
logContractConfig();
```

### In Console

Open browser DevTools Console and check for:
```
🔧 CeloFlow Contract Configuration
Network: Celo Alfajores
Chain ID: 44787
Contract Address: 0x...
✅ Status: Properly Configured
```

## Network Configuration

### Celo Alfajores Testnet

- **Chain ID:** 44787
- **RPC URL:** https://celo-alfajores.drpc.org
- **Block Explorer:** https://alfajores.celoscan.io
- **Faucet:** https://faucet.celo.org

### Add to MetaMask

1. Open MetaMask
2. Networks → Add Network → Add a network manually
3. Enter:
   - **Network Name:** Celo Alfajores
   - **RPC URL:** https://celo-alfajores.drpc.org
   - **Chain ID:** 44787
   - **Currency Symbol:** CELO
   - **Block Explorer:** https://alfajores.celoscan.io

## Security Best Practices

### ✅ DO:
- Keep `.env.local` in your `.gitignore`
- Use actual deployed contract addresses
- Verify contract address on block explorer
- Update contract address after redeployment

### ❌ DON'T:
- Commit `.env.local` to Git
- Use burn addresses (0x0000...0000 or 0x...dEaD)
- Use placeholder/test addresses in production
- Share private keys in environment files

## Troubleshooting

### Build Fails With Contract Error

If you see errors during `npm run build`:

1. Check `.env.local` exists
2. Verify contract address is set
3. Ensure address format is correct
4. Restart build process

### Contract Not Interacting

If contract calls fail:

1. Verify you're on Celo Alfajores network
2. Check contract address is deployed
3. Ensure you have CELO for gas fees
4. Check browser console for errors

### Configuration Not Updating

If changes to `.env.local` don't take effect:

1. Stop development server (Ctrl+C)
2. Clear Next.js cache: `rm -rf .next`
3. Restart: `npm run dev`

## References

- [CeloFlow Contract Source](./contracts/CeloFlow.sol)
- [Celo Documentation](https://docs.celo.org)
- [Alfajores Testnet](https://docs.celo.org/network/alfajores)
- [MetaMask Setup](https://docs.celo.org/wallet/metamask/setup)

## Support

For issues or questions:
1. Check this guide first
2. Review console errors
3. Verify on block explorer
4. Check contract deployment logs
