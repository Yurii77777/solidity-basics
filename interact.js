import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const contractJson = JSON.parse(fs.readFileSync("./build/FirstContract.json", "utf8"));

const interactWithContract = async () => {
  try {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const contract = new ethers.Contract(contractAddress, contractJson.abi, wallet);

    // Read the current value of the message variable
    const currentMessage = await contract.message();
    console.log("📜 Current message:", currentMessage);

    // Call setMessage
    console.log("✏️ Update the message ...");
    const tx = await contract.setMessage("Hey from ethers.js!");
    await tx.wait();

    // Read the new value
    const updatedMessage = await contract.message();
    console.log("✅ Updated message:", updatedMessage);
  } catch (error) {
    console.error("❌ Interaction error:", error);
  }
};

interactWithContract();
