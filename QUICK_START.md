# CeloFlow Quick Start Guide

## What is CeloFlow?

CeloFlow is a real-time salary streaming dApp that allows employers to stream salaries per second in cUSD stablecoins, and employees to withdraw earnings anytime. Perfect for freelancers and gig workers in emerging markets.

## 5-Minute Setup

### 1. Start Development Server

```bash
pnpm install
pnpm dev
```

Then open `http://localhost:3000`

### 2. Test the App

#### Option A: Quick Test (No Contract Deployment Needed)
1. Click "I'm an Employer" or "I'm an Employee"
2. Use the Wallet Connect button (test with mock addresses)
3. Create streams and withdraw (UI will work with placeholder data)

#### Option B: Full Deployment (With Smart Contract)

1. Set up `.env.local`:
```bash
cp .env.example .env.local
```

2. Add your private key (for testnet only):
```
PRIVATE_KEY=your_private_key_here
```

3. Deploy contract:
```bash
npx hardhat run scripts/deploy.ts --network alfajores
```

4. Copy the contract address from output and add to `.env.local`:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

5. Restart dev server

## Key Features Implemented

- **Employer Dashboard**: Create salary streams with employee address, amount, and duration
- **Employee Dashboard**: View active streams with live earnings counter updating per second
- **Live Earnings Counter**: Animated counter showing real-time earnings, per-hour rate, per-day rate
- **Wallet Integration**: RainbowKit + Wagmi for seamless Web3 UX
- **Mobile-First**: Optimized for MiniPay and mobile browsers
- **Smart Contract**: Solidity contract with salary streaming logic and withdrawals

## Project Structure

```
CeloFlow/
├── app/page.tsx                  # Landing page with role selection
├── app/layout.tsx               # Root layout with Web3 provider
├── contracts/SalaryStream.sol    # Smart contract (salary streaming)
├── scripts/deploy.ts             # Deployment script for Celo Alfajores
├── components/
│   ├── employer-dashboard.tsx    # Employer UI (create streams)
│   ├── employee-dashboard.tsx    # Employee UI (view & withdraw)
│   ├── live-earnings-counter.tsx # Real-time earnings display
│   └── wallet-provider.tsx       # Web3 setup (Wagmi + RainbowKit)
├── hooks/use-salary-stream.ts    # Web3 contract hooks
└── lib/contract.ts               # Contract ABI & addresses
```

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS, Shadcn/ui
- **Web3**: Wagmi, RainbowKit, Ethers.js, Viem
- **Blockchain**: Solidity, Hardhat, Celo Alfajores (testnet)
- **Styling**: Tailwind CSS with custom mobile optimizations

## Demo Walkthrough

### For Judges (3-5 minutes)

1. **Homepage** (30 sec)
   - Show the landing page design
   - Explain the problem statement

2. **Employer Role** (1.5 min)
   - Click "I'm an Employer"
   - Fill in sample data:
     - Employee: `0x1234...` (any address)
     - Amount: `100` cUSD
     - Duration: `30` days
   - Show the "Create Stream" button
   - Point out the dashboard showing active streams

3. **Employee Role** (1.5 min)
   - Click "I'm an Employee"
   - Show the live earnings counter incrementing every second
   - Explain the per-second, per-hour, and per-day rates
   - Show the withdraw button
   - Point out mobile optimization

4. **Mobile View** (1 min)
   - Open DevTools with mobile viewport
   - Show responsive design
   - Demonstrate touch-friendly buttons

## Environment Variables

### Required for Full Features
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...  # Deployed contract address
```

### Optional for Deployment
```
PRIVATE_KEY=your_pk_here             # For contract deployment
CELOSCAN_API_KEY=your_key_here       # For contract verification
```

## Common Issues & Solutions

**Issue**: "Contract address not found"
- **Solution**: Deploy contract first with `npx hardhat run scripts/deploy.ts --network alfajores`

**Issue**: "Wallet not connected"
- **Solution**: Click the wallet button in the top right, it will prompt you to connect

**Issue**: "Mobile view looks wrong"
- **Solution**: Make sure viewport metadata is correct in `app/layout.tsx`

## Next Steps

1. **Local Testing**: Test both employer and employee roles
2. **Contract Deployment**: Deploy to Celo Alfajores testnet
3. **Testing with Real Wallets**: Use MiniPay or MetaMask with testnet funds
4. **UI Refinements**: Customize colors and branding as needed
5. **Feature Additions**: Add stream pausing, cancellation, history tracking

## Helpful Links

- [Celo Docs](https://docs.celo.org)
- [MiniPay Guide](https://docs.celo.org/general/platforms/minipay)
- [Wagmi Docs](https://wagmi.sh)
- [RainbowKit](https://rainbowkit.com)
- [Hardhat](https://hardhat.org)

## Support

For deployment help:
1. Check the `.env.example` file for all available configuration options
2. Review the smart contract in `contracts/SalaryStream.sol`
3. See the full README.md for detailed documentation

Good luck with your hackathon submission!
