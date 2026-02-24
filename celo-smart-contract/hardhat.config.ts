import "@nomicfoundation/hardhat-toolbox";
import { HardhatUserConfig } from "hardhat/config";
import * as dotenv from "dotenv";

dotenv.config();

const privateKey = process.env.PRIVATE_KEY;
const celoSepoliaRpc =
  process.env.CELO_SEPOLIA_RPC_URL || "https://forno.celo-sepolia.celo-testnet.org";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: { enabled: true, runs: 200 }
    }
  },
  networks: {
    celoSepolia: {
      chainId: 11142220,
      url: celoSepoliaRpc,
      accounts: privateKey ? [`0x${privateKey.replace(/^0x/, "")}`] : []
    }
  }
};

export default config;
