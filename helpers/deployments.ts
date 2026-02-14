// Saves and reads deployed contract addresses per network
// Stored in deployments/<network>.json (e.g. deployments/localhost.json)

import fs from "fs";
import path from "path";

import { ContractName } from "../constants";

const DEPLOYMENTS_DIR = path.join(__dirname, "..", "deployments");

interface Deployments {
  [contractName: string]: string;
}

// Save deployed address to JSON (creates file/dir if missing)
export function writeDeployment(
  networkName: string,
  contractName: ContractName,
  address: string,
): void {
  if (!fs.existsSync(DEPLOYMENTS_DIR)) {
    fs.mkdirSync(DEPLOYMENTS_DIR, { recursive: true });
  }

  const filePath = path.join(DEPLOYMENTS_DIR, `${networkName}.json`);

  let deployments: Deployments = {};
  if (fs.existsSync(filePath)) {
    deployments = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }

  deployments[contractName] = address;
  fs.writeFileSync(filePath, JSON.stringify(deployments, null, 2));
}

// Read deployed address from JSON (throws if not found)
export function readDeployment(networkName: string, contractName: ContractName): string {
  const filePath = path.join(DEPLOYMENTS_DIR, `${networkName}.json`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`No deployments found for network "${networkName}". Run deploy first.`);
  }

  const deployments: Deployments = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const address = deployments[contractName];
  if (!address) {
    throw new Error(`Contract "${contractName}" not found in ${networkName} deployments.`);
  }

  return address;
}
