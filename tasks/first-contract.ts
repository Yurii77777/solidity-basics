// Hardhat tasks for FirstContract interaction (E1–E2)

import { task } from "hardhat/config";

import { CONTRACTS } from "../constants";
import { readDeployment } from "../helpers/deployments";

task("first-contract:read", "Read current message from FirstContract")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ address }, { ethers, network }) => {
    const contractAddress = address || readDeployment(network.name, CONTRACTS.FirstContract);

    const contract = await ethers.getContractAt(CONTRACTS.FirstContract, contractAddress);

    const message = await contract.message();
    console.log("Current message:", message);
  });

task("first-contract:set-message", "Update message in FirstContract")
  .addParam("message", "New message text")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ message, address }, { ethers, network }) => {
    const contractAddress = address || readDeployment(network.name, CONTRACTS.FirstContract);

    const contract = await ethers.getContractAt(CONTRACTS.FirstContract, contractAddress);

    console.log("Updating message...");
    const tx = await contract.setMessage(message);
    await tx.wait();

    const updated = await contract.message();
    console.log("Updated message:", updated);
  });
