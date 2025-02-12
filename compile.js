import { readFile, writeFile, mkdir, access } from "fs/promises";
import solc from "solc";

const buildDir = "./build";

const compileContract = async () => {
  try {
    // Check if the “build” folder exists and create it if not
    try {
      await access(buildDir);
    } catch {
      await mkdir(buildDir, { recursive: true });
    }

    // Read the contract code
    const source = await readFile("./contracts/firstContract.sol", "utf8");

    // Generating input data for the compiler
    const input = {
      language: "Solidity",
      sources: {
        "firstContract.sol": { content: source },
      },
      settings: {
        outputSelection: {
          "*": { "*": ["abi", "evm.bytecode"] },
        },
      },
    };

    // Performing the compilation
    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    // Get ABI and contract bytecode
    const contract = output.contracts["firstContract.sol"].FirstContract;
    const compiledData = {
      abi: contract.abi,
      bytecode: contract.evm.bytecode.object,
    };

    // Save the results to a file
    await writeFile("./build/FirstContract.json", JSON.stringify(compiledData, null, 2));

    console.log("✅ The contract has been successfully compiled!");
  } catch (error) {
    console.error("❌ Compilation error:", error);
  }
};

// Run the compilation function
compileContract();
