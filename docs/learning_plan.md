# Solidity Learning Plan — YouTube Series (5-10 min episodes)

> Updated: February 2026
> Solidity latest stable: **0.8.33** | Tooling: Hardhat + ethers.js v6
> Testnet: **Sepolia** (Goerli discontinued April 2024)
> OpenZeppelin: **v5.x** (custom errors, namespaced storage)
>
> План побудований на реальних задачах, за які платять на фрілансі.
> Кожна секція поступово ускладнює проєкт і додає практичні навички.

---

## Section 1. Introduction — Setup & First Smart Contract

### E1. Setup. Creating and compiling a simple smart contract ✅

- What is Solidity, EVM, smart contracts
- Project setup: Node.js + solc-js + ESM
- Write `FirstContract.sol` (string storage + setter)
- Compile with `compile.js` → ABI + bytecode JSON

### E2. Migration to Hardhat + TypeScript ✅

- Why Hardhat: native compilation, TypeChain, built-in accounts
- TypeScript: typed contracts, autocomplete, compile-time checks
- Architecture: constants, generic deploy, Hardhat Tasks
- Full workflow: compile → deploy → interact via CLI

---

## Section 2. Solidity Syntax Fundamentals

### E3. Contract structure & basic types

- `pragma`, `SPDX-License`, `import`, `contract`
- Value types: `uint`, `int`, `bool`, `address`
- `string`, `bytes`
- `storage` vs `memory` vs `calldata`

### E4. Arrays, structs, mappings

- Fixed & dynamic arrays
- Structs (custom types)
- Mappings (key-value storage)
- Nested mappings

### E5. Functions — visibility & state mutability

- `public`, `private`, `internal`, `external`
- `view`, `pure`
- `returns` syntax
- Function overloading

### E6. Events, errors, and modifiers

- `event` + `emit` (logging for frontends)
- `require`, `revert`, custom errors (Solidity 0.8+ style)
- Why custom errors are cheaper than revert strings
- `modifier` for access control patterns

### E7. Practice — Tip Jar contract

- `payable` functions, `msg.value`, `msg.sender`
- `mapping(address => uint)` for tracking contributions
- Withdraw with `onlyOwner` modifier
- Events for all deposits and withdrawals
- _Real-world use case: donation/tip contracts on Fiverr ($200–$800)_

---

## Section 3. Transactions, ETH & Gas

### E8. Working with ETH — payable, receive, fallback

- `msg.sender`, `msg.value`, `block.timestamp`
- `payable` functions and `receive()`/`fallback()`
- **Important:** use `call{value: ...}("")` NOT `transfer()`/`send()` (deprecated in 0.9.0)

### E9. Gas — how it works & optimization

- What is gas, gas limit, gas price
- Why storage is expensive
- Optimization: variable packing, `uint256` as native size, `calldata` vs `memory`
- Reading gas reports with Hardhat

### E10. Practice — ETH Vault contract

- Accept deposits, track per-user balances
- Withdraw with checks-effects-interactions pattern
- Time-lock: withdraw only after N blocks
- Emit events for all state changes
- _Real-world use case: escrow / vault contracts ($1,000–$5,000)_

---

## Section 4. Inheritance, Interfaces & OpenZeppelin

### E12. Contract inheritance

- `is` keyword, single & multiple inheritance
- `virtual` / `override`
- `super` calls
- Constructor inheritance

### E13. Abstract contracts & interfaces

- When to use `abstract` vs `interface`
- Implementing interfaces (e.g., IERC20)
- Why interfaces matter for composability

### E14. OpenZeppelin — standard library for Solidity

- What is OpenZeppelin and why everyone uses it
- `Ownable`, `AccessControl` — role-based permissions
- `ReentrancyGuard`, `Pausable` — security primitives
- How to install and import (`@openzeppelin/contracts`)

### E15. Practice — Role-based access contract

- Owner + admin roles via `AccessControl`
- Pausable functionality
- Transfer ownership pattern
- _Real-world use case: access control is in every production contract_

---

## Section 5. Testing

### E16. Testing with Hardhat + Chai

- Writing unit tests in TypeScript
- `expect`, `revertedWith`, `emit` assertions
- Testing events, reverts, and state changes
- Running tests & reading output

### E17. Testing patterns for real contracts

- Testing access control (only owner can call X)
- Testing with multiple accounts (signers)
- Time manipulation (`evm_increaseTime`)
- Gas usage snapshots
- Aiming for high coverage

### E18. Introduction to Foundry (optional)

- What is Foundry & why it's gaining popularity
- Tests written in Solidity (not JS)
- `forge test`, `forge build`
- Foundry + Hardhat side-by-side

---

## Section 6. ERC-20 Token — #1 Freelance Gig

> ERC-20 token creation is the single most common smart contract gig.
> Token + staking + vesting = "token launch package" ($3,000–$15,000).

### E19. ERC-20 — how it works

- Interface: `totalSupply`, `balanceOf`, `transfer`, `approve`, `transferFrom`
- Allowance pattern explained
- Why ERC-20 exists (interoperability with wallets, DEXes, protocols)

### E20. Build your own ERC-20 token

- Implement from scratch (learning purpose)
- Refactor using OpenZeppelin v5 `ERC20`
- Extensions: `Burnable`, `Pausable`, `Capped`
- Deploy & test locally

### E21. Token Staking contract

- Stake token X, earn rewards over time
- Lock periods, early withdrawal penalty
- Reward calculation (per-second accrual)
- _Real-world use case: staking contracts ($2,000–$10,000)_

### E22. Token Vesting contract

- Cliff + linear vesting schedule
- Beneficiary claims, revocable by owner
- Multiple beneficiaries (team, investors, advisors)
- _Real-world use case: vesting for every token launch ($2,000–$8,000)_

---

## Section 7. NFT — ERC-721 & ERC-1155

### E23. ERC-721 — how NFTs work

- What is ERC-721 and how it differs from ERC-20
- Metadata, `tokenURI`, on-chain vs off-chain storage
- IPFS / Arweave for media files

### E24. Build your own NFT contract

- OpenZeppelin v5 `ERC721`
- Allowlist minting with Merkle proofs
- Reveal mechanics (hidden → revealed metadata)
- Royalties with ERC-2981
- _Real-world use case: NFT collection launch ($1,000–$5,000)_

### E25. ERC-1155 — multi-token standard

- When to use ERC-1155 vs ERC-721
- Batch operations, efficiency gains
- Real-world: gaming items, tickets, editions
- _Growing demand for gaming NFTs_

### E26. Simple NFT Marketplace

- List, buy, cancel listing
- Auction mechanics (English auction)
- Royalty distribution on secondary sales
- _Real-world use case: marketplace contracts ($1,500–$15,000)_

---

## Section 8. Security & Auditing

> Security expertise is the highest-value differentiator.
> Auditors earn $100–$200/hr. Top competitive auditors $200k–$600k/year.

### E27. Common vulnerabilities

- Reentrancy (the classic)
- Access control issues
- Front-running
- Unchecked return values
- Integer overflow (pre-0.8 vs post-0.8)

### E28. Security patterns & best practices

- Checks-Effects-Interactions
- ReentrancyGuard (OpenZeppelin)
- Pull over push payments
- Minimal proxy (ERC-1167) for gas savings

### E29. Audit tools & practice

- Slither (static analysis)
- Mythril (symbolic execution)
- Aderyn (Rust-based linter)
- Ethernaut: solve 2-3 levels on video
- _Real-world: Code4rena, Sherlock, Immunefi bug bounties_

---

## Section 9. Deploy to Real Networks

### E30. Deploy to Sepolia testnet

- Get Sepolia ETH from faucet
- Configure Hardhat for Sepolia (Alchemy/Infura RPC)
- Deploy & verify on Etherscan

### E31. Contract verification & Etherscan

- Verify source code on Etherscan
- Read/write via Etherscan UI
- How others can interact with your verified contract

### E32. L2 Deployment — Polygon, Arbitrum, Base

- Why L2: cheaper gas, same Solidity code
- Hardhat multi-network config
- Deploy to Base or Arbitrum testnet
- _Real-world: most new projects deploy to L2, not Ethereum L1_

---

## Section 10. DeFi Patterns — Real-World Projects

> DeFi development: $100–$200/hr. DEX contracts: $5,000–$50,000.

### E33. Token Presale / Launchpad contract

- Whitelist presale with caps per address
- Soft cap / hard cap logic
- Claim tokens after presale ends
- Refund if soft cap not reached
- _Real-world use case: IDO/launchpad ($2,000–$8,000)_

### E34. DEX interaction — Uniswap

- How Uniswap V2 works (factory, pair, router)
- Creating a liquidity pool for your token
- Swapping tokens programmatically
- Reading prices from on-chain

### E35. DAO Governance

- Governor + Timelock pattern (OpenZeppelin)
- Propose, vote, execute
- Token-weighted voting
- Treasury management
- _Real-world use case: DAO contracts ($5,000–$30,000)_

---

## Bonus / Future Topics

### B1. Upgradeable contracts (Proxy patterns)

- Why contracts are immutable but upgradeable via proxy
- Transparent proxy vs UUPS
- OpenZeppelin upgrades plugin
- _Real-world: almost every production DeFi protocol uses proxies_

### B2. Account abstraction (ERC-4337 + EIP-7702)

- Smart wallets, gasless transactions, session keys
- What changed with Pectra upgrade (May 2025)
- _Growing demand as projects simplify UX_

### B3. RWA Tokenization (Real-World Assets)

- Security tokens (ERC-3643 / ERC-1400)
- Compliance enforcement, transfer restrictions
- Dividend distribution
- _Fastest growing segment: $24B market, projected $100B+ by end of 2026_

### B4. Preparing for Solidity 0.9.0

- Deprecated features: `transfer()`, `send()`, ABI coder v1
- Migration checklist

---

## Freelance Career Path

**Phase 1 — Foundation** (Sections 1–5)
Basic Solidity + Hardhat + testing. No earning yet.

**Phase 2 — First Gigs** (Sections 6–7)
ERC-20 tokens, staking, NFTs. Fiverr/Upwork: $500–$5,000 per project.

**Phase 3 — Mid-Market** (Sections 8–10)
Security, DeFi patterns, L2 deployment. Upwork: $5,000–$20,000 per project.

**Phase 4 — Senior** (Bonus topics)
Upgradeable contracts, RWA, audit competitions. $150–$200/hr.
