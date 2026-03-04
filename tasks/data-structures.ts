// Hardhat tasks for DataStructures contract interaction (E4)

import { task } from "hardhat/config";

import { CONTRACTS } from "../constants";
import { readDeployment } from "../helpers/deployments";

// ============ Fixed Array Tasks ============

task("data:set-score", "Set a score in the fixed array")
  .addParam("index", "Array index (0-4)")
  .addParam("value", "Score value")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ index, value, address }, { ethers, network }) => {
    const contractAddress =
      address || readDeployment(network.name, CONTRACTS.DataStructures);
    const contract = await ethers.getContractAt(
      CONTRACTS.DataStructures,
      contractAddress,
    );

    console.log(`Setting score at index ${index} to ${value}`);
    const tx = await contract.setScore(index, value);
    await tx.wait();

    const updated = await contract.getScore(index);
    console.log("Updated score:", updated.toString());
  });

task("data:get-scores", "Get all scores from fixed array")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ address }, { ethers, network }) => {
    const contractAddress =
      address || readDeployment(network.name, CONTRACTS.DataStructures);
    const contract = await ethers.getContractAt(
      CONTRACTS.DataStructures,
      contractAddress,
    );

    const scores = await contract.getAllScores();
    console.log(
      "Top scores:",
      scores.map((s: bigint) => s.toString()),
    );
  });

// ============ Dynamic Array Tasks ============

task("data:add-number", "Add a number to dynamic array")
  .addParam("value", "Number to add")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ value, address }, { ethers, network }) => {
    const contractAddress =
      address || readDeployment(network.name, CONTRACTS.DataStructures);
    const contract = await ethers.getContractAt(
      CONTRACTS.DataStructures,
      contractAddress,
    );

    console.log(`Adding number: ${value}`);
    const tx = await contract.addNumber(value);
    await tx.wait();

    const length = await contract.getNumbersLength();
    console.log("Array length:", length.toString());
  });

task("data:remove-number", "Remove a number by index (swap-and-pop)")
  .addParam("index", "Index to remove")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ index, address }, { ethers, network }) => {
    const contractAddress =
      address || readDeployment(network.name, CONTRACTS.DataStructures);
    const contract = await ethers.getContractAt(
      CONTRACTS.DataStructures,
      contractAddress,
    );

    console.log(`Removing number at index: ${index}`);
    const tx = await contract.removeNumberByIndex(index);
    await tx.wait();

    const all = await contract.getAllNumbers();
    console.log(
      "Numbers after removal:",
      all.map((n: bigint) => n.toString()),
    );
  });

task("data:get-numbers", "Get all numbers from dynamic array")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ address }, { ethers, network }) => {
    const contractAddress =
      address || readDeployment(network.name, CONTRACTS.DataStructures);
    const contract = await ethers.getContractAt(
      CONTRACTS.DataStructures,
      contractAddress,
    );

    const all = await contract.getAllNumbers();
    const length = await contract.getNumbersLength();
    console.log(
      "Numbers:",
      all.map((n: bigint) => n.toString()),
    );
    console.log("Length:", length.toString());
  });

// ============ Whitelist Tasks ============

task("data:add-whitelist", "Add address to whitelist")
  .addParam("addr", "Address to add")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ addr, address }, { ethers, network }) => {
    const contractAddress =
      address || readDeployment(network.name, CONTRACTS.DataStructures);
    const contract = await ethers.getContractAt(
      CONTRACTS.DataStructures,
      contractAddress,
    );

    console.log(`Adding to whitelist: ${addr}`);
    const tx = await contract.addToWhitelist(addr);
    await tx.wait();

    const length = await contract.getWhitelistLength();
    console.log("Whitelist length:", length.toString());
  });

task("data:remove-whitelist", "Remove address from whitelist by index")
  .addParam("index", "Index to remove")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ index, address }, { ethers, network }) => {
    const contractAddress =
      address || readDeployment(network.name, CONTRACTS.DataStructures);
    const contract = await ethers.getContractAt(
      CONTRACTS.DataStructures,
      contractAddress,
    );

    console.log(`Removing whitelist entry at index: ${index}`);
    const tx = await contract.removeFromWhitelist(index);
    await tx.wait();

    const list = await contract.getWhitelist();
    console.log("Whitelist after removal:", list);
  });

task("data:check-whitelist", "Check if address is whitelisted")
  .addParam("addr", "Address to check")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ addr, address }, { ethers, network }) => {
    const contractAddress =
      address || readDeployment(network.name, CONTRACTS.DataStructures);
    const contract = await ethers.getContractAt(
      CONTRACTS.DataStructures,
      contractAddress,
    );

    const result = await contract.isWhitelisted(addr);
    console.log(`Address ${addr} whitelisted:`, result);
  });

task("data:get-whitelist", "Get full whitelist")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ address }, { ethers, network }) => {
    const contractAddress =
      address || readDeployment(network.name, CONTRACTS.DataStructures);
    const contract = await ethers.getContractAt(
      CONTRACTS.DataStructures,
      contractAddress,
    );

    const list = await contract.getWhitelist();
    const length = await contract.getWhitelistLength();
    console.log("Whitelist:", list);
    console.log("Length:", length.toString());
  });

// ============ Struct (User Array) Tasks ============

task("data:create-user", "Create a new user")
  .addParam("name", "User name")
  .addParam("balance", "Initial balance")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ name, balance, address }, { ethers, network }) => {
    const contractAddress =
      address || readDeployment(network.name, CONTRACTS.DataStructures);
    const contract = await ethers.getContractAt(
      CONTRACTS.DataStructures,
      contractAddress,
    );

    console.log(`Creating user: ${name} with balance: ${balance}`);
    const tx = await contract.createUser(name, balance);
    await tx.wait();

    const count = await contract.getUserCount();
    console.log("Total users:", count.toString());
  });

task("data:get-user", "Get user by index")
  .addParam("index", "User index")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ index, address }, { ethers, network }) => {
    const contractAddress =
      address || readDeployment(network.name, CONTRACTS.DataStructures);
    const contract = await ethers.getContractAt(
      CONTRACTS.DataStructures,
      contractAddress,
    );

    const [name, balance, isActive, createdAt] = await contract.getUser(index);
    console.log("=== User ===");
    console.log("Name:", name);
    console.log("Balance:", balance.toString());
    console.log("Active:", isActive);
    console.log("Created at:", new Date(Number(createdAt) * 1000).toISOString());
  });

task("data:deactivate-user", "Deactivate user by index")
  .addParam("index", "User index")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ index, address }, { ethers, network }) => {
    const contractAddress =
      address || readDeployment(network.name, CONTRACTS.DataStructures);
    const contract = await ethers.getContractAt(
      CONTRACTS.DataStructures,
      contractAddress,
    );

    console.log(`Deactivating user at index: ${index}`);
    const tx = await contract.deactivateUser(index);
    await tx.wait();

    const [name, , isActive] = await contract.getUser(index);
    console.log(`User "${name}" active:`, isActive);
  });

task("data:user-count", "Get total user count")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ address }, { ethers, network }) => {
    const contractAddress =
      address || readDeployment(network.name, CONTRACTS.DataStructures);
    const contract = await ethers.getContractAt(
      CONTRACTS.DataStructures,
      contractAddress,
    );

    const count = await contract.getUserCount();
    console.log("Total users:", count.toString());
  });

// ============ Mapping Tasks ============

task("data:set-balance", "Set balance for an address")
  .addParam("addr", "Target address")
  .addParam("amount", "Balance amount")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ addr, amount, address }, { ethers, network }) => {
    const contractAddress =
      address || readDeployment(network.name, CONTRACTS.DataStructures);
    const contract = await ethers.getContractAt(
      CONTRACTS.DataStructures,
      contractAddress,
    );

    console.log(`Setting balance for ${addr}: ${amount}`);
    const tx = await contract.setBalance(addr, amount);
    await tx.wait();

    const updated = await contract.getBalance(addr);
    console.log("Updated balance:", updated.toString());
  });

task("data:get-balance", "Get balance for an address")
  .addParam("addr", "Target address")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ addr, address }, { ethers, network }) => {
    const contractAddress =
      address || readDeployment(network.name, CONTRACTS.DataStructures);
    const contract = await ethers.getContractAt(
      CONTRACTS.DataStructures,
      contractAddress,
    );

    const balance = await contract.getBalance(addr);
    console.log(`Balance for ${addr}:`, balance.toString());
  });

task("data:add-balance", "Add to balance for an address")
  .addParam("addr", "Target address")
  .addParam("amount", "Amount to add")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ addr, amount, address }, { ethers, network }) => {
    const contractAddress =
      address || readDeployment(network.name, CONTRACTS.DataStructures);
    const contract = await ethers.getContractAt(
      CONTRACTS.DataStructures,
      contractAddress,
    );

    const before = await contract.getBalance(addr);
    console.log("Balance before:", before.toString());

    const tx = await contract.addToBalance(addr, amount);
    await tx.wait();

    const after = await contract.getBalance(addr);
    console.log("Balance after:", after.toString());
  });

// ============ Profile Tasks ============

task("data:create-profile", "Create profile for the sender")
  .addParam("name", "Profile name")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ name, address }, { ethers, network }) => {
    const contractAddress =
      address || readDeployment(network.name, CONTRACTS.DataStructures);
    const contract = await ethers.getContractAt(
      CONTRACTS.DataStructures,
      contractAddress,
    );

    const [signer] = await ethers.getSigners();
    console.log(`Creating profile for ${signer.address} with name: "${name}"`);

    const tx = await contract.createProfile(name);
    await tx.wait();

    const exists = await contract.profileExists(signer.address);
    console.log("Profile created:", exists);
  });

task("data:get-profile", "Get profile for an address")
  .addParam("addr", "Address to look up")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ addr, address }, { ethers, network }) => {
    const contractAddress =
      address || readDeployment(network.name, CONTRACTS.DataStructures);
    const contract = await ethers.getContractAt(
      CONTRACTS.DataStructures,
      contractAddress,
    );

    const [name, balance, isActive, createdAt] = await contract.getProfile(addr);
    console.log("=== Profile ===");
    console.log("Name:", name);
    console.log("Balance:", balance.toString());
    console.log("Active:", isActive);
    console.log("Created at:", new Date(Number(createdAt) * 1000).toISOString());
  });

task("data:deactivate-profile", "Deactivate sender's profile")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ address }, { ethers, network }) => {
    const contractAddress =
      address || readDeployment(network.name, CONTRACTS.DataStructures);
    const contract = await ethers.getContractAt(
      CONTRACTS.DataStructures,
      contractAddress,
    );

    const [signer] = await ethers.getSigners();
    console.log(`Deactivating profile for ${signer.address}`);

    const tx = await contract.deactivateProfile();
    await tx.wait();

    const [, , isActive] = await contract.getProfile(signer.address);
    console.log("Profile active:", isActive);
  });

// ============ Nested Mapping: Allowance Tasks ============

task("data:set-allowance", "Set allowance for a spender (ERC-20 pattern)")
  .addParam("spender", "Spender address")
  .addParam("amount", "Allowance amount")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ spender, amount, address }, { ethers, network }) => {
    const contractAddress =
      address || readDeployment(network.name, CONTRACTS.DataStructures);
    const contract = await ethers.getContractAt(
      CONTRACTS.DataStructures,
      contractAddress,
    );

    const [signer] = await ethers.getSigners();
    console.log(`Setting allowance: ${signer.address} → ${spender} = ${amount}`);

    const tx = await contract.setAllowance(spender, amount);
    await tx.wait();

    const updated = await contract.getAllowance(signer.address, spender);
    console.log("Updated allowance:", updated.toString());
  });

task("data:get-allowance", "Get allowance for owner → spender")
  .addParam("owner", "Owner address")
  .addParam("spender", "Spender address")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ owner, spender, address }, { ethers, network }) => {
    const contractAddress =
      address || readDeployment(network.name, CONTRACTS.DataStructures);
    const contract = await ethers.getContractAt(
      CONTRACTS.DataStructures,
      contractAddress,
    );

    const allowance = await contract.getAllowance(owner, spender);
    console.log(`Allowance ${owner} → ${spender}:`, allowance.toString());
  });

// ============ Nested Mapping: Permission Tasks ============

task("data:set-permission", "Set permission for a user")
  .addParam("user", "User address")
  .addParam("id", "Permission ID")
  .addParam("granted", "Granted (true/false)")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ user, id, granted, address }, { ethers, network }) => {
    const contractAddress =
      address || readDeployment(network.name, CONTRACTS.DataStructures);
    const contract = await ethers.getContractAt(
      CONTRACTS.DataStructures,
      contractAddress,
    );

    const grantedBool = granted.toLowerCase() === "true";
    console.log(`Setting permission ${id} for ${user}: ${grantedBool}`);

    const tx = await contract.setPermission(user, id, grantedBool);
    await tx.wait();

    const result = await contract.hasPermission(user, id);
    console.log("Permission set:", result);
  });

task("data:check-permission", "Check if user has permission")
  .addParam("user", "User address")
  .addParam("id", "Permission ID")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ user, id, address }, { ethers, network }) => {
    const contractAddress =
      address || readDeployment(network.name, CONTRACTS.DataStructures);
    const contract = await ethers.getContractAt(
      CONTRACTS.DataStructures,
      contractAddress,
    );

    const result = await contract.hasPermission(user, id);
    console.log(`Permission ${id} for ${user}:`, result);
  });

// ============ Utility Tasks ============

task("data:summary", "Get contract summary (counts)")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ address }, { ethers, network }) => {
    const contractAddress =
      address || readDeployment(network.name, CONTRACTS.DataStructures);
    const contract = await ethers.getContractAt(
      CONTRACTS.DataStructures,
      contractAddress,
    );

    const [numbersCount, whitelistCount, usersCount] =
      await contract.getContractSummary();

    console.log("=== Contract Summary ===");
    console.log("Numbers array:", numbersCount.toString());
    console.log("Whitelist:", whitelistCount.toString());
    console.log("Users:", usersCount.toString());
  });
