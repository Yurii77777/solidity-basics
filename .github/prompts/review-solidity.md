# Solidity Basics Review - Repository-Specific Overlay

**Extends**: `.github/prompts/review-base.md`

Use the base review prompt for structure, output format, deduplication rules, and review philosophy. This overlay defines all project-specific rules, patterns, and checks.

---

## Repository Context

- **Purpose**: Learning project for Solidity smart contract development (YouTube episode series)
- **Tech Stack**: Solidity 0.8.28, Hardhat v2, TypeScript, ethers.js v6, TypeChain
- **Architecture**: One contract per episode, constants-driven deployment, Hardhat Tasks for interaction
- **Author**: Beginner learning Solidity — educational contracts, not production DeFi

---

## File Type Handling (Extends Base)

**ALSO REVIEW IN DETAIL:**

- Solidity contracts (`contracts/*.sol`)
- Constants files (`constants/*.ts`)
- Task files (`tasks/*.ts`)
- Deploy scripts (`scripts/*.ts`)
- Helper files (`helpers/*.ts`)
- Hardhat config (`hardhat.config.ts`)

**ALSO SKIP:**

- TypeChain generated types (`typechain-types/`)
- Deployment artifacts (`deployments/`)
- Documentation files (`docs/*.md`) — Ukrainian educational notes, skip unless content affects code

---

## Project Severity Rules

These map to the base prompt's generic severity tiers. Use the base definitions for general issues; use these for project-specific violations.

### 🔴 CRITICAL

| Rule | Why |
| --- | --- |
| Solidity security vulnerabilities (reentrancy, unchecked external calls, tx.origin auth) | Smart contract bugs are irreversible after deployment |
| Missing `require`/`revert` for input validation in public/external functions | Unvalidated input can corrupt contract state |
| Hardcoded contract names in tasks/scripts | Must use `CONTRACTS` from `constants/contracts.ts` — magic strings break the pattern |
| Missing contract entry in `constants/contracts.ts` or `constructor-args.ts` | Deploy script fails, breaks the established workflow |
| Using `transfer()` or `send()` for ETH transfers | Must use `call{value:}("")` — `transfer`/`send` have 2300 gas limit, breaks with EIP-1884 |
| Floating pragma (e.g., `pragma solidity >=0.4.0`) | Must use caret pragma (`^0.8.28`) — prevents unexpected compiler behavior |

### 🟠 HIGH

| Rule | Why |
| --- | --- |
| Missing task import in `tasks/index.ts` | Tasks silently unavailable in Hardhat CLI |
| Missing `deploy:<name>` script in `package.json` | Breaks the standard deployment workflow |
| Task parameter names that don't match contract function signatures | Confusing UX, docs show wrong params |
| Using `readDeployment` without fallback to `--address` param | Task fails without prior deployment |
| Missing `await tx.wait()` after state-changing calls in tasks | Task reads stale state before tx confirms |
| Gas-inefficient patterns in loops (storage reads inside loops, unbounded iterations) | Educational contract should demonstrate best practices |
| Inconsistent task naming (not following `prefix:action` pattern) | All tasks follow `<contract-prefix>:<action>` convention |

### 🟡 MEDIUM

| Rule | Why |
| --- | --- |
| Over-commenting (comments that restate the code) | Code should be self-explanatory per project rules |
| Missing NatSpec on public/external functions (`@notice`, `@param`, `@return`) | Educational project — NatSpec helps learners understand intent |
| Inconsistent function visibility (`public` when `external` would suffice) | `external` is cheaper for functions only called from outside |
| Missing events for state changes | Best practice for off-chain tracking, important to teach |
| Redundant state variables that could be derived | Unnecessary storage costs |

---

## Mandatory Project Patterns

### 1. Constants-Driven Architecture

All contract names flow through constants — no magic strings anywhere:

```typescript
// CORRECT: constants/contracts.ts
export const CONTRACTS = {
  FirstContract: "FirstContract",
  TypesDemo: "TypesDemo",
  DataStructures: "DataStructures",
} as const;

// CORRECT: Using constant in task
const contract = await ethers.getContractAt(CONTRACTS.DataStructures, contractAddress);

// WRONG: Magic string
const contract = await ethers.getContractAt("DataStructures", contractAddress);
```

**Constructor args must also be registered:**
```typescript
// constants/constructor-args.ts
export const CONSTRUCTOR_ARGS: Record<ContractName, unknown[]> = {
  [CONTRACTS.DataStructures]: [],
};
```

### 2. Task Pattern

Every contract gets a dedicated task file following the established pattern:

```typescript
// CORRECT: tasks/<contract>.ts
import { task } from "hardhat/config";
import { CONTRACTS } from "../constants";
import { readDeployment } from "../helpers/deployments";

task("prefix:action", "Description")
  .addParam("value", "Param description")
  .addOptionalParam("address", "Contract address (reads from deployments if omitted)")
  .setAction(async ({ value, address }, { ethers, network }) => {
    const contractAddress =
      address || readDeployment(network.name, CONTRACTS.ContractName);
    const contract = await ethers.getContractAt(
      CONTRACTS.ContractName,
      contractAddress,
    );

    const tx = await contract.someFunction(value);
    await tx.wait();

    const updated = await contract.someGetter();
    console.log("Result:", updated.toString());
  });
```

**Rules:**
- Task prefix matches contract: `types:*` for TypesDemo, `data:*` for DataStructures
- Every task has `--address` optional param as fallback
- State-changing tasks: call → `await tx.wait()` → read back → log
- View tasks: read → log
- Import in `tasks/index.ts`

### 3. Deploy Script

One generic deployer (`scripts/deploy.ts`), contract selected via `CONTRACT_NAME` env var:

```json
// package.json
"deploy:data": "CONTRACT_NAME=DataStructures hardhat run scripts/deploy.ts --network localhost"
```

**Rules:**
- Script name: `deploy:<short-name>`
- No one-off deploy scripts per contract
- All deploy scripts use the same generic deployer

### 4. Solidity Contract Structure

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title ContractName
 * @notice One-line description
 * @dev Educational contract for E<N> episode
 */
contract ContractName {
    // State variables grouped by category with section comments
    // Functions grouped by category
}
```

**Rules:**
- SPDX license first line
- Caret pragma `^0.8.28`
- NatSpec on contract (`@title`, `@notice`, `@dev`)
- NatSpec on public/external functions (`@notice`, `@param`, `@return`)
- Section comments (`// ============ Category ============`) to group related code
- `require()` with message strings for input validation
- No inline assembly unless explicitly educational

### 5. Code Comments

```solidity
// CORRECT: Brief, adds value
// Swap-and-pop: O(1) removal, doesn't preserve order
function removeByIndex(uint256 _index) public { ... }

// CORRECT: Explains WHY, not WHAT
// ERC-20 allowance pattern: owner => spender => amount
mapping(address => mapping(address => uint256)) public allowances;

// WRONG: Restates the code
// Set the uint value
function setUint(uint256 _value) public { myUint = _value; }

// WRONG: Over-commenting obvious code
uint256 public myNumber; // stores a number
```

---

## Solidity-Specific Checks

### Security (even for educational contracts)

- `require()` guards on array index access (prevent out-of-bounds)
- `require()` guards on mapping existence checks where appropriate
- No `tx.origin` for authorization (use `msg.sender`)
- Overflow protection relies on Solidity 0.8+ built-in checks (no need for SafeMath)
- State changes before external calls (checks-effects-interactions pattern)

### Gas Efficiency Patterns

Flag these as educational opportunities (🟡 MEDIUM), not blockers:

- Storage reads inside loops → cache in memory variable
- `public` functions only called externally → should be `external`
- Dynamic arrays returned in view functions → warn about gas cost scaling
- Unbounded loops → note the limitation for large datasets

### Data Location

- `memory` for function parameters that need modification
- `calldata` for external function parameters that are read-only (cheaper)
- `storage` pointers for modifying state variables in-place
- Never use `storage` for function return types

---

## Review Workflow

1. **Scope check** — Identify changed files from PR diff. ONLY review those files
2. **Base compliance** — Deduplication, severity levels, output format
3. **Constants pattern** — Contract registered in `constants/`, no magic strings
4. **Infrastructure** — Deploy script in `package.json`, tasks imported in `tasks/index.ts`
5. **Solidity quality** — NatSpec, require guards, gas patterns, correct data locations
6. **Task quality** — Follows task pattern, param names match contract, `await tx.wait()`
7. **Consistency** — Naming conventions, section comments, code style matches existing contracts
