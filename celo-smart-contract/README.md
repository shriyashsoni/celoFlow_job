# CeloFlow – Salary Streaming (MVP)

Minimal, testnet-ready salary streaming contract for Celo Sepolia.

## Features

- `createStream(employee, duration)` with CELO deposit
- `getAvailable(streamId)` linear unlock amount
- `withdraw(streamId)` by employee
- `cancelStream(streamId)` by employer (settles earned part to employee, refunds remainder)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create env file:

```bash
copy .env.example .env
```

3. Add your deployer private key in `.env`:

```env
PRIVATE_KEY=your_wallet_private_key_without_0x
CELO_SEPOLIA_RPC_URL=https://forno.celo-sepolia.celo-testnet.org
```

## Build

```bash
npm run build
```

## Deploy to Celo Sepolia

```bash
npm run deploy:celo-sepolia
```

Network:
- `Network Name`: `Celo Sepolia Testnet`
- `chainId`: `11142220`
- `RPC`: `https://forno.celo-sepolia.celo-testnet.org`
- `Explorer`: `https://celo-sepolia.blockscout.com`
