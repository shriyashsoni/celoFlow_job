# CeloFlow Deployment Guide

## Overview

This guide walks you through deploying CeloFlow to production on Celo mainnet.

## Prerequisites

- Node.js 18+
- pnpm package manager
- Celo testnet funds (for initial testing)
- A Celo wallet (Valora, MetaMask, MiniPay)
- Private key with testnet funds

## Step-by-Step Deployment

### 1. Testnet Deployment (Alfajores)

#### 1.1 Get Testnet Funds

Visit the [Celo Faucet](https://faucet.celo.org) to get test cELO and cUSD.

#### 1.2 Configure Environment

Create `.env.local`:

```bash
cp .env.example .env.local
```

Add your private key:

```
PRIVATE_KEY=0x... # Your testnet wallet private key
```

#### 1.3 Deploy Contract

```bash
npx hardhat run scripts/deploy.ts --network alfajores
```

Output:
```
SalaryStream deployed to: 0x...
Contract address saved to .env.local
```

#### 1.4 Update Contract Address

The deployment script automatically updates `.env.local` with:

```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

#### 1.5 Restart Dev Server

```bash
pnpm dev
```

Your app is now ready to test on Alfajores testnet!

### 2. Mainnet Deployment (After Testing)

#### 2.1 Prepare Mainnet Wallet

1. Create a new wallet specifically for mainnet
2. Transfer funds from exchange to wallet
3. Keep private key safe (use hardware wallet for production)

#### 2.2 Update Network Configuration

In `.env.local`, ensure you have mainnet setup:

```
PRIVATE_KEY=0x... # Mainnet private key (different from testnet!)
```

#### 2.3 Deploy to Mainnet

```bash
npx hardhat run scripts/deploy.ts --network celo
```

#### 2.4 Verify Contract

Optional but recommended for transparency:

```bash
npx hardhat verify --network celo <CONTRACT_ADDRESS> <CONSTRUCTOR_ARGS>
```

Set `CELOSCAN_API_KEY` in `.env.local` for verification:

```
CELOSCAN_API_KEY=your_celoscan_api_key_here
```

#### 2.5 Update Frontend

Update `.env.local`:

```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... # Mainnet contract address
```

### 3. Frontend Deployment (Vercel)

#### 3.1 Push to GitHub

```bash
git add .
git commit -m "Deploy CeloFlow to production"
git push origin main
```

#### 3.2 Connect to Vercel

1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables:
   - `NEXT_PUBLIC_CONTRACT_ADDRESS`: Your mainnet contract address
4. Deploy

#### 3.3 Configure Custom Domain

In Vercel dashboard:
1. Project Settings → Domains
2. Add your custom domain
3. Update DNS records as indicated

### 4. Post-Deployment Checklist

- [ ] Contract deployed and verified on Celoscan
- [ ] Frontend deployed on Vercel
- [ ] Environment variables correctly set
- [ ] Custom domain working
- [ ] Tested employer dashboard on mainnet
- [ ] Tested employee dashboard on mainnet
- [ ] Tested wallet connections
- [ ] Tested on mobile (MiniPay)

## Testing on Mainnet

### For Employers

1. Connect mainnet wallet
2. Create a test stream (small amount for testing)
3. Verify transaction on [Celoscan](https://celoscan.io)
4. Check employer dashboard shows stream

### For Employees

1. Receive employee address from employer
2. Connect wallet
3. See active stream
4. Verify earnings counter increments
5. Test withdrawal (if amount available)

## Monitoring & Maintenance

### Logs

View deployment logs in Vercel:
1. Vercel Dashboard → Deployments
2. Click on deployment to see logs

### Contract Monitoring

Monitor contract transactions:
- [Celoscan](https://celoscan.io) - Mainnet block explorer
- [Alfajores Celoscan](https://alfajores.celoscan.io) - Testnet explorer

### Performance

Monitor frontend performance:
- Vercel Web Analytics
- PageSpeed Insights

## Rollback Plan

If issues occur:

1. **Frontend Issues**
   - Vercel automatically keeps previous deployments
   - Click "Revert" on a previous deployment

2. **Contract Issues**
   - Cannot change deployed smart contract
   - Deploy new version if needed
   - Update `NEXT_PUBLIC_CONTRACT_ADDRESS` in frontend

## Security Checklist

- [ ] Private keys never committed to git
- [ ] `.env.local` is in `.gitignore`
- [ ] Environment variables set in Vercel dashboard
- [ ] Contract code audited (for production)
- [ ] No hardcoded secrets in code
- [ ] HTTPS enabled (Vercel default)

## Cost Estimation

### Celo Network Costs

Transaction costs on Celo are extremely low:

- Contract deployment: ~0.01 CELO (~$0.001)
- Create stream: ~0.001 CELO (~$0.0001)
- Withdraw: ~0.001 CELO (~$0.0001)

### Infrastructure Costs

- Vercel: Free tier or ~$20/month Pro
- Domain: ~$10-15/year (optional)

## Advanced Configuration

### Custom RPC Endpoint

In `hardhat.config.ts`:

```typescript
alfajores: {
  url: 'https://your-rpc-endpoint.com',
  accounts: [process.env.PRIVATE_KEY]
}
```

### Gas Price Optimization

In contract deployment:

```typescript
const overrides = {
  gasPrice: ethers.parseUnits('0.1', 'gwei'),
  gasLimit: 300000,
};
```

### Rate Limiting

Add rate limiting for API calls in production:

```typescript
// Implement in your API routes
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
```

## Troubleshooting

### Contract Deployment Fails

```bash
# Check account has enough funds
node -e "require('ethers').getDefaultProvider('https://alfajores-forno.celo-testnet.org').getBalance('0x...')"

# Check private key is valid
node -e "console.log(require('ethers').getDefaultProvider())"
```

### Frontend Won't Deploy

1. Check build succeeds locally: `pnpm build`
2. Check environment variables in Vercel
3. Check package.json has all dependencies
4. Check Node version is 18+

### Wallet Connection Issues

1. Clear browser cache and cookies
2. Try different wallet (MetaMask, Valora)
3. Check network is correct (Celo mainnet)
4. Check contract address is correct in `.env`

## Support & Resources

- **Celo Docs**: https://docs.celo.org
- **Hardhat Docs**: https://hardhat.org
- **Vercel Docs**: https://vercel.com/docs
- **Celoscan**: https://celoscan.io

## Version Control

Tag releases in git:

```bash
git tag -a v1.0.0 -m "CeloFlow mainnet release"
git push origin v1.0.0
```

This completes the deployment guide. Your CeloFlow is now ready for production!
