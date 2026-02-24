import { ethers } from 'hardhat';

// cUSD token address on Celo Alfajores
const cUSD_ADDRESS = '0x874069Fa1Eb16D44d622F2e0ca25eeA172369bC1';

async function main() {
  console.log('Deploying SalaryStream contract...');

  const [deployer] = await ethers.getSigners();
  console.log('Deploying with account:', deployer.address);

  // Get account balance
  const balance = await deployer.provider?.getBalance(deployer.address);
  console.log('Account balance:', ethers.formatEther(balance || '0'), 'CELO');

  // Deploy SalaryStream contract
  const SalaryStream = await ethers.getContractFactory('SalaryStream');
  const salaryStream = await SalaryStream.deploy(cUSD_ADDRESS);

  await salaryStream.waitForDeployment();

  const contractAddress = await salaryStream.getAddress();
  console.log('SalaryStream deployed to:', contractAddress);

  // Save contract address to environment file
  const fs = require('fs');
  const path = require('path');

  const envPath = path.join(__dirname, '../.env.local');
  const envContent = `NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}\n`;

  if (fs.existsSync(envPath)) {
    const currentContent = fs.readFileSync(envPath, 'utf-8');
    if (!currentContent.includes('NEXT_PUBLIC_CONTRACT_ADDRESS')) {
      fs.appendFileSync(envPath, envContent);
    }
  } else {
    fs.writeFileSync(envPath, envContent);
  }

  console.log('Contract address saved to .env.local');
  console.log('\nDeployment complete!');
  console.log('Contract Address:', contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
