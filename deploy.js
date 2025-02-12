import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

// Loading ABI and Bytecode from the compilation file
const contractJson = JSON.parse(fs.readFileSync("./build/FirstContract.json", "utf8"));

const deployContract = async () => {
  try {
    // Connect to the local Hardhat test network
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

    // Using the first account with Hardhat Node
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // Preparing a contract for deployment
    const ContractFactory = new ethers.ContractFactory(contractJson.abi, contractJson.bytecode, wallet);

    console.log("⏳ Deploying the contract ...");
    const contract = await ContractFactory.deploy();

    console.log("✅ The contract is available at:", contract.target);
  } catch (error) {
    console.error("❌ Deployment error:", error);
  }
};

deployContract();
