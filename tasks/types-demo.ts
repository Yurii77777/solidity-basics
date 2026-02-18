// Hardhat tasks for TypesDemo contract interaction (E3)

import { task } from "hardhat/config";

import { CONTRACTS } from "../constants";
import { readDeployment } from "../helpers/deployments";

// ============ Uint Tasks ============

task("types:set-uint", "Set uint256 value")
  .addParam("value", "Uint value to set")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ value, address }, { ethers, network }) => {
    const contractAddress = address || readDeployment(network.name, CONTRACTS.TypesDemo);
    const contract = await ethers.getContractAt(CONTRACTS.TypesDemo, contractAddress);

    console.log(`Setting uint to: ${value}`);
    const tx = await contract.setUint(value);
    await tx.wait();

    const updated = await contract.myUint();
    console.log("Updated uint:", updated.toString());
  });

task("types:increment", "Increment uint by 1")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ address }, { ethers, network }) => {
    const contractAddress = address || readDeployment(network.name, CONTRACTS.TypesDemo);
    const contract = await ethers.getContractAt(CONTRACTS.TypesDemo, contractAddress);

    const before = await contract.myUint();
    console.log("Before:", before.toString());

    const tx = await contract.incrementUint();
    await tx.wait();

    const after = await contract.myUint();
    console.log("After increment:", after.toString());
  });

task("types:max-uint", "Get max uint256 value")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ address }, { ethers, network }) => {
    const contractAddress = address || readDeployment(network.name, CONTRACTS.TypesDemo);
    const contract = await ethers.getContractAt(CONTRACTS.TypesDemo, contractAddress);

    const maxUint = await contract.getMaxUint();
    console.log("Max uint256:", maxUint.toString());
  });

// ============ Int Tasks ============

task("types:set-int", "Set int256 value (can be negative)")
  .addParam("value", "Int value to set")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ value, address }, { ethers, network }) => {
    const contractAddress = address || readDeployment(network.name, CONTRACTS.TypesDemo);
    const contract = await ethers.getContractAt(CONTRACTS.TypesDemo, contractAddress);

    console.log(`Setting int to: ${value}`);
    const tx = await contract.setInt(value);
    await tx.wait();

    const updated = await contract.myInt();
    console.log("Updated int:", updated.toString());
  });

task("types:int-limits", "Get min and max int256 values")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ address }, { ethers, network }) => {
    const contractAddress = address || readDeployment(network.name, CONTRACTS.TypesDemo);
    const contract = await ethers.getContractAt(CONTRACTS.TypesDemo, contractAddress);

    const [min, max] = await contract.getIntLimits();
    console.log("Int256 min:", min.toString());
    console.log("Int256 max:", max.toString());
  });

// ============ Bool Tasks ============

task("types:toggle-bool", "Toggle boolean value")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ address }, { ethers, network }) => {
    const contractAddress = address || readDeployment(network.name, CONTRACTS.TypesDemo);
    const contract = await ethers.getContractAt(CONTRACTS.TypesDemo, contractAddress);

    const before = await contract.myBool();
    console.log("Before:", before);

    const tx = await contract.toggleBool();
    await tx.wait();

    const after = await contract.myBool();
    console.log("After toggle:", after);
  });

task("types:set-bool", "Set boolean value")
  .addParam("value", "Bool value (true/false)")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ value, address }, { ethers, network }) => {
    const contractAddress = address || readDeployment(network.name, CONTRACTS.TypesDemo);
    const contract = await ethers.getContractAt(CONTRACTS.TypesDemo, contractAddress);

    const boolValue = value.toLowerCase() === "true";
    console.log(`Setting bool to: ${boolValue}`);

    const tx = await contract.setBool(boolValue);
    await tx.wait();

    const updated = await contract.myBool();
    console.log("Updated bool:", updated);
  });

// ============ Address Tasks ============

task("types:set-address", "Set address value")
  .addParam("addr", "Address to set")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ addr, address }, { ethers, network }) => {
    const contractAddress = address || readDeployment(network.name, CONTRACTS.TypesDemo);
    const contract = await ethers.getContractAt(CONTRACTS.TypesDemo, contractAddress);

    console.log(`Setting address to: ${addr}`);
    const tx = await contract.setAddress(addr);
    await tx.wait();

    const updated = await contract.myAddress();
    console.log("Updated address:", updated);
  });

task("types:get-balance", "Get balance of stored address")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ address }, { ethers, network }) => {
    const contractAddress = address || readDeployment(network.name, CONTRACTS.TypesDemo);
    const contract = await ethers.getContractAt(CONTRACTS.TypesDemo, contractAddress);

    const storedAddress = await contract.myAddress();
    const balance = await contract.getAddressBalance();

    console.log("Stored address:", storedAddress);
    console.log("Balance (wei):", balance.toString());
    console.log("Balance (ETH):", ethers.formatEther(balance));
  });

task("types:address-convert", "Convert between address and uint160")
  .addParam("value", "Address or uint160 to convert")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ value, address }, { ethers, network }) => {
    const contractAddress = address || readDeployment(network.name, CONTRACTS.TypesDemo);
    const contract = await ethers.getContractAt(CONTRACTS.TypesDemo, contractAddress);

    // Check if input is address or number
    if (value.startsWith("0x") && value.length === 42) {
      // Convert address to uint160
      const uint = await contract.addressToUint(value);
      console.log("Address:", value);
      console.log("As uint160:", uint.toString());
    } else {
      // Convert uint160 to address
      const addr = await contract.uintToAddress(value);
      console.log("Uint160:", value);
      console.log("As address:", addr);
    }
  });

// ============ String Tasks ============

task("types:set-string", "Set string value")
  .addParam("value", "String to set")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ value, address }, { ethers, network }) => {
    const contractAddress = address || readDeployment(network.name, CONTRACTS.TypesDemo);
    const contract = await ethers.getContractAt(CONTRACTS.TypesDemo, contractAddress);

    console.log(`Setting string to: "${value}"`);
    const tx = await contract.setString(value);
    await tx.wait();

    const updated = await contract.myString();
    console.log("Updated string:", updated);
  });

task("types:string-length", "Get string length")
  .addParam("value", "String to measure")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ value, address }, { ethers, network }) => {
    const contractAddress = address || readDeployment(network.name, CONTRACTS.TypesDemo);
    const contract = await ethers.getContractAt(CONTRACTS.TypesDemo, contractAddress);

    const length = await contract.getStringLength(value);
    console.log(`String: "${value}"`);
    console.log("Length (bytes):", length.toString());
  });

task("types:compare-locations", "Compare memory vs calldata (demonstrates data locations)")
  .addParam("str1", "First string (will be in memory)")
  .addParam("str2", "Second string (will be in calldata)")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ str1, str2, address }, { ethers, network }) => {
    const contractAddress = address || readDeployment(network.name, CONTRACTS.TypesDemo);
    const contract = await ethers.getContractAt(CONTRACTS.TypesDemo, contractAddress);

    const areEqual = await contract.compareMemoryVsCalldata(str1, str2);

    console.log(`Memory string: "${str1}"`);
    console.log(`Calldata string: "${str2}"`);
    console.log("Are equal:", areEqual);
  });

// ============ Bytes Tasks ============

task("types:set-bytes", "Set bytes value")
  .addParam("value", "Hex bytes (e.g., 0x1234)")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ value, address }, { ethers, network }) => {
    const contractAddress = address || readDeployment(network.name, CONTRACTS.TypesDemo);
    const contract = await ethers.getContractAt(CONTRACTS.TypesDemo, contractAddress);

    console.log(`Setting bytes to: ${value}`);
    const tx = await contract.setBytes(value);
    await tx.wait();

    const updated = await contract.myBytes();
    console.log("Updated bytes:", updated);

    const length = await contract.getBytesLength();
    console.log("Length:", length.toString());
  });

task("types:set-bytes32", "Set bytes32 value")
  .addParam("value", "Hex bytes32 (e.g., 0x1234...)")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ value, address }, { ethers, network }) => {
    const contractAddress = address || readDeployment(network.name, CONTRACTS.TypesDemo);
    const contract = await ethers.getContractAt(CONTRACTS.TypesDemo, contractAddress);

    console.log(`Setting bytes32 to: ${value}`);
    const tx = await contract.setBytes32(value);
    await tx.wait();

    const updated = await contract.myBytes32();
    console.log("Updated bytes32:", updated);

    const firstByte = await contract.getFirstByteFromBytes32();
    console.log("First byte:", firstByte);
  });

task("types:string-to-bytes32", "Convert string to bytes32")
  .addParam("value", "String to convert (max 32 bytes)")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ value, address }, { ethers, network }) => {
    const contractAddress = address || readDeployment(network.name, CONTRACTS.TypesDemo);
    const contract = await ethers.getContractAt(CONTRACTS.TypesDemo, contractAddress);

    const bytes32Value = await contract.stringToBytes32(value);
    console.log(`String: "${value}"`);
    console.log("As bytes32:", bytes32Value);
  });

// ============ Data Location Demo Tasks ============

task("types:storage-ref-demo", "Demonstrate storage reference behavior")
  .addParam("value", "New string value to set via storage reference")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ value, address }, { ethers, network }) => {
    const contractAddress = address || readDeployment(network.name, CONTRACTS.TypesDemo);
    const contract = await ethers.getContractAt(CONTRACTS.TypesDemo, contractAddress);

    const before = await contract.myString();
    console.log("String before:", before);

    console.log(`Modifying via storage reference to: "${value}"`);
    const tx = await contract.storageReferenceDemo(value);
    await tx.wait();

    const after = await contract.myString();
    console.log("String after (modified via storage reference):", after);
  });

task("types:memory-copy-demo", "Demonstrate memory copy behavior")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ address }, { ethers, network }) => {
    const contractAddress = address || readDeployment(network.name, CONTRACTS.TypesDemo);
    const contract = await ethers.getContractAt(CONTRACTS.TypesDemo, contractAddress);

    const [original, modified] = await contract.memoryCopyDemo();
    console.log("Original (storage):", original);
    console.log("Modified (memory copy):", modified);
    console.log("Note: storage was NOT affected by memory modification");
  });

// ============ Utility Tasks ============

task("types:get-all", "Get all stored values at once")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ address }, { ethers, network }) => {
    const contractAddress = address || readDeployment(network.name, CONTRACTS.TypesDemo);
    const contract = await ethers.getContractAt(CONTRACTS.TypesDemo, contractAddress);

    const [myUint, myInt, myBool, myAddress, myString, myBytes, myBytes32] =
      await contract.getAllValues();

    console.log("=== All Stored Values ===");
    console.log("uint256:", myUint.toString());
    console.log("int256:", myInt.toString());
    console.log("bool:", myBool);
    console.log("address:", myAddress);
    console.log("string:", myString);
    console.log("bytes:", myBytes);
    console.log("bytes32:", myBytes32);
  });

task("types:reset-all", "Reset all values to defaults")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ address }, { ethers, network }) => {
    const contractAddress = address || readDeployment(network.name, CONTRACTS.TypesDemo);
    const contract = await ethers.getContractAt(CONTRACTS.TypesDemo, contractAddress);

    console.log("Resetting all values...");
    const tx = await contract.resetAll();
    await tx.wait();

    const [myUint, myInt, myBool, myAddress, myString, myBytes, myBytes32] =
      await contract.getAllValues();

    console.log("=== Values After Reset ===");
    console.log("uint256:", myUint.toString());
    console.log("int256:", myInt.toString());
    console.log("bool:", myBool);
    console.log("address:", myAddress);
    console.log("string:", myString);
    console.log("bytes:", myBytes);
    console.log("bytes32:", myBytes32);
  });
