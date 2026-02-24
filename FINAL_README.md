# CeloFlow — Final Technical README

Comprehensive reference for CeloFlow frontend, smart contracts, architecture, deployment, and configured addresses.

---

## 1) Project Summary

CeloFlow is a payroll streaming dApp where employers fund salary streams and employees withdraw earnings continuously over time.

This repository currently contains **two smart-contract tracks**:

1. **Primary app contract (root):** `contracts/SalaryStream.sol`
   - ERC-20 token-based streaming (intended for cUSD)
   - Hardhat config at `hardhat.config.ts`
   - Deploy script at `scripts/deploy.ts`

2. **Secondary contract module:** `celo-smart-contract/contracts/CeloFlow.sol`
   - Native CELO streaming (`payable` deposits)
   - Independent Hardhat project under `celo-smart-contract/`

The frontend in `app/` is wired via `lib/contract.ts` and currently defaults to a configured on-chain address if env vars are missing.

---

## 2) High-Level Architecture

```text
┌────────────────────────────────────────────────────────────────────┐
│ Frontend (Next.js 16, React 19, Tailwind 4, shadcn/ui)            │
│                                                                    │
│  app/page.tsx (landing + hero + wallet connect)                   │
│  app/dashboard/* (employer/employee dashboard routes)             │
│  components/* (UI + stream views + counters)                      │
└────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────┐
│ Web3 Integration Layer                                             │
│  - RainbowKit + Wagmi + Viem + Ethers                             │
│  - ABI in lib/abi.json                                             │
│  - Address/config in lib/contract.ts                               │
└────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌────────────────────────────────────────────────────────────────────┐
│ Celo Networks                                                      │
│  - Alfajores (44787)                                               │
│  - Celo Mainnet (42220)                                            │
│  - Celo Sepolia (11142220) used in secondary module               │
└────────────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
┌──────────────────────────────┐   ┌──────────────────────────────┐
│ contracts/SalaryStream.sol   │   │ celo-smart-contract/         │
│ (ERC20/cUSD streaming)       │   │ contracts/CeloFlow.sol       │
│                              │   │ (native CELO streaming)      │
└──────────────────────────────┘   └──────────────────────────────┘
```

---

## 3) Smart Contracts

## 3.1 Root Contract: `contracts/SalaryStream.sol`

### Purpose
Token-based salary streaming (designed for cUSD on Celo).

### Core Model
```solidity
struct Stream {
  address employer;
  address employee;
  uint256 totalAmount;
  uint256 startTime;
  uint256 duration;
  uint256 withdrawnAmount;
  bool active;
}
```

### Core Functions
- `createStream(address _employee, uint256 _duration)`
- `getAvailable(uint256 _streamId)`
- `withdraw(uint256 _streamId)`
- `cancelStream(uint256 _streamId)`
- `getTotalEarned(uint256 _streamId)`
- `getStream(uint256 _streamId)`

### Security/Behavior Notes
- Uses `ReentrancyGuard`.
- Uses ERC-20 `transferFrom`/`transfer` for settlement.
- Important behavior in current code:
  - `createStream` infers `amount` from token allowance if `msg.value == 0`.
  - Contract constructor takes `_tokenAddress` (token contract address).

## 3.2 Secondary Contract: `celo-smart-contract/contracts/CeloFlow.sol`

### Purpose
Native CELO streaming via `payable` deposits.

### Core Functions
- `createStream(address _employee, uint256 _duration) external payable`
- `getAvailable(uint256 _streamId)`
- `withdraw(uint256 _streamId)`
- `cancelStream(uint256 _streamId)`

### Notes
- Independent deployment path in `celo-smart-contract/scripts/deploy.ts`.
- Emits `StreamCreated`, `Withdrawn`, and `StreamCancelled`.

---

## 4) Deployment Address Matrix (Current State)

## 4.1 Known configured addresses in repo

| Item | Network | Address | Source |
|------|---------|---------|--------|
| Frontend default CeloFlow contract | (fallback in frontend) | `0x24bE9C74CFCA5313f388c87106cb7B4a41A8F3c9` | `lib/contract.ts` |
| cUSD token | Alfajores | `0x874069Fa1Eb16D44d622F2e0ca25eeA172369bC1` | `scripts/deploy.ts` |
| cUSD token | Celo Mainnet | `0x765DE816845861e75A25fCA122bb6898B6F02217` | `TECHNICAL_SPEC.md` |

## 4.2 Fill these with your actual deployments

| Contract | Alfajores | Mainnet | Celo Sepolia |
|----------|-----------|---------|--------------|
| `SalaryStream` (root) | `<ADD_DEPLOYED_ADDRESS>` | `<ADD_DEPLOYED_ADDRESS>` | N/A |
| `CeloFlow` (secondary) | N/A | N/A | `<ADD_DEPLOYED_ADDRESS>` |

---

## 5) Network & Environment Configuration

Create local env:

```bash
cp .env.example .env.local
```

Recommended variables:

```env
# Frontend contract address
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
# Optional alternative name used by lib/contract.ts
NEXT_PUBLIC_CELOFLOW_CONTRACT_ADDRESS=0x...

# Deployer key for root Hardhat project
PRIVATE_KEY=0x...

# Optional explorer verification key
CELOSCAN_API_KEY=...
```

Secondary module (`celo-smart-contract`) uses:

```env
PRIVATE_KEY=...
CELO_SEPOLIA_RPC_URL=https://forno.celo-sepolia.celo-testnet.org
```

---

## 6) Build, Run, and Deploy

## 6.1 Frontend

```bash
pnpm install
pnpm dev
```

## 6.2 Deploy root `SalaryStream`

```bash
npx hardhat run scripts/deploy.ts --network alfajores
# or
npx hardhat run scripts/deploy.ts --network celo
```

After deployment, set:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=<YOUR_DEPLOYED_SALARYSTREAM_ADDRESS>
```

## 6.3 Deploy secondary `CeloFlow`

```bash
cd celo-smart-contract
npm install
npm run deploy:celo-sepolia
```

---

## 7) Frontend Contract Wiring

`lib/contract.ts` resolves the contract address in this order:

1. `NEXT_PUBLIC_CELOFLOW_CONTRACT_ADDRESS`
2. `NEXT_PUBLIC_CONTRACT_ADDRESS`
3. fallback constant `0x24bE9C74CFCA5313f388c87106cb7B4a41A8F3c9`

If you redeploy contracts, always update env vars so frontend points to the correct address.

---

## 8) Current Gaps / Consistency Notes

- `lib/wagmi-config.ts` is currently empty.
- `lib/contract.ts` labels `CELO_ALFAJORES_*` but maps it to Sepolia values (`11142220`), so naming/config should be aligned before production.
- Repository contains both token-based and native-CELO stream contracts; keep only one canonical deployment path for production to avoid integration confusion.

---

## 9) Recommended Production Checklist

- Finalize one canonical contract (`SalaryStream` or `CeloFlow`).
- Run full contract tests and add invariant/security tests.
- Verify deployed contracts on explorer.
- Pin and document exact production addresses.
- Set frontend env vars in hosting platform (e.g., Vercel).
- Perform test flows (create stream, live accrual, withdraw, cancel).
- Conduct external security review/audit before real payroll usage.

---

## 10) Key Paths

- Frontend app: `app/`
- UI components: `components/`
- Root contract: `contracts/SalaryStream.sol`
- Root deployment script: `scripts/deploy.ts`
- Frontend ABI/address config: `lib/abi.json`, `lib/contract.ts`
- Secondary contract module: `celo-smart-contract/`

---

If you want this file to become the main README, replace `README.md` with this content and keep old docs as supporting references (`DEPLOYMENT.md`, `TECHNICAL_SPEC.md`, etc.).
