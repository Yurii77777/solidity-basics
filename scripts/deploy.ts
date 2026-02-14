// Generic deploy script — CONTRACT_NAME env var selects which contract to deploy
// Usage: CONTRACT_NAME=FirstContract hardhat run scripts/deploy.ts --network localhost

import { ethers, network } from "hardhat";

import { CONTRACTS, CONSTRUCTOR_ARGS, ContractName } from "../constants";
import { writeDeployment } from "../helpers/deployments";

const contractName = process.env.CONTRACT_NAME as ContractName | undefined;

if (!contractName) {
  console.error("CONTRACT_NAME env variable is required.");
  console.error("Available contracts:", Object.keys(CONTRACTS).join(", "));
  process.exit(1);
}

if (!Object.values(CONTRACTS).includes(contractName)) {
  console.error(`Unknown contract: "${contractName}"`);
  console.error("Available contracts:", Object.keys(CONTRACTS).join(", "));
  process.exit(1);
}

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying from:", deployer.address);

  const args = CONSTRUCTOR_ARGS[contractName] || [];
  console.log("Constructor args:", args.length ? args : "(none)");

  const contract = await ethers.deployContract(contractName, args);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log(`${contractName} deployed to:`, address);

  writeDeployment(network.name, contractName, address);
  console.log(`Saved to deployments/${network.name}.json`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
