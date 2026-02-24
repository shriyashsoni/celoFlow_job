import { ethers } from "hardhat";

async function main() {
  const CeloFlow = await ethers.getContractFactory("CeloFlow");
  const celoFlow = await CeloFlow.deploy();

  await celoFlow.waitForDeployment();

  console.log("CeloFlow deployed to:", await celoFlow.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
