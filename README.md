# CeloFlow - Real-Time Salary Streaming

CeloFlow enables real-time salary streaming in stablecoins, allowing freelancers and gig workers to get paid per second directly on Celo and MiniPay.

## Features

- **Per-Second Payments**: Earn and withdraw salary anytime, not just monthly
- **Live Earnings Counter**: Watch your balance grow in real-time with per-second precision
- **Mobile-First**: Fully optimized for MiniPay users
- **Transparent**: All transactions are on-chain and verifiable
- **Stablecoin-Powered**: Uses cUSD for price stability

## Quick Start

### Prerequisites

- Node.js 18+ and pnpm
- A wallet with testnet funds (Celo Alfajores)
- Private key for contract deployment (optional for testing)

### Installation

1. Clone the repository and install dependencies:

```bash
pnpm install
```

2. Set up environment variables:

```bash
cp .env.example .env.local
```

3. Add your contract address to `.env.local`:

```
NEXT_PUBLIC_CONTRACT_ADDRESS=0x... # Add deployed contract address
```

### Development

Start the development server:

```bash
pnpm dev
```

Open http://localhost:3000 in your browser to see CeloFlow in action.

### Smart Contract Deployment

1. Ensure you have a private key in `.env.local`:

```bash
PRIVATE_KEY=your_private_key_here
```

2. Deploy to Celo Alfajores (testnet):

```bash
npx hardhat run scripts/deploy.ts --network alfajores
```

The contract address will be saved to `.env.local` automatically.

## Architecture

### Frontend

- **Next.js 16**: Modern React framework with App Router
- **Wagmi**: Web3 React hooks for Ethereum/Celo
- **RainbowKit**: Beautiful wallet connection UI
- **Shadcn/ui**: Accessible component library
- **Tailwind CSS**: Utility-first styling

### Smart Contracts

- **SalaryStream.sol**: Core contract for salary streaming logic
- **Solidity 0.8.20**: With reentrancy protection
- **Hardhat**: Contract compilation and deployment

### Blockchain

- **Celo Alfajores**: Testnet for development
- **cUSD**: Celo USD stablecoin for payments
- **MiniPay**: Mobile wallet for Celo

## User Flows

### Employer

1. Connect wallet
2. Enter employee address
3. Specify salary amount and duration
4. Click "Create Stream"
5. Employer's cUSD is locked in the contract

### Employee

1. Connect wallet
2. View active salary streams
3. Watch earnings increase per second
4. Click "Withdraw" to get available funds anytime

## Project Structure

```
.
├── contracts/
│   └── SalaryStream.sol         # Main smart contract
├── scripts/
│   └── deploy.ts                # Deployment script
├── app/
│   ├── page.tsx                 # Home page with role selection
│   ├── layout.tsx               # Root layout with wallet provider
│   └── globals.css              # Global styles
├── components/
│   ├── employer-dashboard.tsx    # Employer UI
│   ├── employee-dashboard.tsx    # Employee UI
│   ├── live-earnings-counter.tsx # Real-time earnings display
│   ├── wallet-provider.tsx       # Web3 setup
│   └── ui/                       # Shadcn components
├── hooks/
│   └── use-salary-stream.ts      # Web3 contract interactions
├── lib/
│   └── contract.ts               # Contract ABI and addresses
├── hardhat.config.ts             # Hardhat configuration
└── package.json                  # Dependencies
```

## Demo Walkthrough

### For Judges/Evaluators

1. **Homepage**: Explains CeloFlow and problem it solves
2. **Employer Role**: 
   - Create a stream for 5 cUSD over 1 minute
   - Watch the transaction
3. **Employee Role**:
   - See the stream you created
   - Watch earnings increase every second
   - Withdraw available funds

### Expected Results

- Salary streams are created transparently on-chain
- Earnings update in real-time (per-second precision)
- Withdrawals are instant via smart contract
- Mobile-optimized UI works great on phone browsers

## Next Steps for Production

1. **Mainnet Deployment**: Deploy to Celo mainnet
2. **Enhanced Features**:
   - Pause/resume streams
   - Stream cancellation with refunds
   - NFT proof-of-work for streams
   - Batch operations for multiple employees
3. **UI Improvements**:
   - Transaction history
   - Stream analytics dashboard
   - Multi-currency support
4. **Security**:
   - Formal security audit
   - Timelock for admin functions
   - Emergency pause mechanism

## Network Details

### Celo Alfajores (Testnet)

- **Chain ID**: 44787
- **RPC**: https://alfajores-forno.celo-testnet.org
- **cUSD Address**: 0x874069Fa1Eb16D44d622F2e0ca25eeA172369bC1
- **Faucet**: https://faucet.celo.org

### Celo Mainnet

- **Chain ID**: 42220
- **RPC**: https://forno.celo.org

## Support & Resources

- [Celo Docs](https://docs.celo.org)
- [MiniPay Guide](https://docs.celo.org/general/platforms/minipay)
- [Hardhat Docs](https://hardhat.org)
- [Wagmi Docs](https://wagmi.sh)

## License

MIT

## Questions?

For hackathon submissions, prepare to explain:

- How CeloFlow solves real payroll delays
- Why Celo/cUSD is crucial for emerging markets
- Technical implementation details
- Live demo walkthrough

Good luck!
