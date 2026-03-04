# Project: Solidity Basics — YouTube Learning Series

## What this is

A learning project for Solidity smart contract development. The author (@yu_dev01) is learning Solidity and recording short 5-10 min YouTube episodes. Each episode adds a new contract or concept, progressively building real-world skills.

The full learning plan is in `docs/learning_plan.md`. It's built around real freelance demand — ERC-20 tokens, staking, NFT, DeFi patterns — not theoretical exercises.

## Current state

**Completed:** E1 (setup + first contract), E2 (migration to Hardhat + TypeScript), E3 (contract structure & basic types), E4 (arrays, structs, mappings).

**Contracts:**
- `contracts/firstContract.sol` — E1 learning artifact (simple string storage)
- `contracts/TypesDemo.sol` — E3 demo of value types, reference types, and data locations
- `contracts/DataStructures.sol` — E4 demo of arrays, structs, mappings, and nested mappings

**Stack:** Hardhat v2 + TypeScript + ethers.js v6 + TypeChain. Solidity 0.8.28.

## Project architecture

```
contracts/           — Solidity contracts (one per episode or logical group)
constants/           — project constants (contract names, constructor args)
  contracts.ts       — CONTRACTS + ContractName type
  constructor-args.ts — CONSTRUCTOR_ARGS
  index.ts           — barrel export
helpers/
  deployments.ts     — save/read deployed addresses (writeDeployment/readDeployment)
scripts/
  deploy.ts          — generic deployer, CONTRACT_NAME via env var
tasks/
  <contract>.ts      — Hardhat Tasks for contract interaction
  index.ts           — barrel import (loaded in hardhat.config.ts)
docs/                — per-episode notes in Ukrainian
```

## How to add a new contract

1. Create `.sol` in `contracts/`
2. Add entry in `constants/` (CONTRACTS in contracts.ts + CONSTRUCTOR_ARGS in constructor-args.ts)
3. Add `"deploy:<name>"` script in `package.json`
4. Create task file in `tasks/` + import in `tasks/index.ts`
5. `yarn compile` to generate TypeChain types

## Commands

```bash
yarn start                   # start local blockchain (terminal 1) — alias for hardhat node
yarn compile                 # compile + TypeChain types
yarn deploy:first            # deploy FirstContract to localhost
yarn deploy:types            # deploy TypesDemo to localhost
yarn deploy:data             # deploy DataStructures to localhost
npx hardhat <task> --network localhost   # run a task (e.g., types:set-uint --value 42)
yarn test                    # run tests

# Alternative (if yarn start doesn't work):
npx hardhat node             # start local blockchain directly
```

## Rules for AI assistants

- **Language:** Documentation and notes (`docs/`) are written in Ukrainian. Code comments in English — tiny, concise, only where not self-evident.
- **No premature work.** Don't create contracts, docs, or infrastructure for future episodes unless explicitly asked. Each episode is done step by step.
- **No over-commenting.** Code should be self-explanatory. Add comments only for non-obvious things.
- **No magic strings.** All contract names go through `constants/`.
- **Test through actual workflow.** Verify via `yarn` scripts and `npx hardhat` tasks, not by running hardhat directly with grep or other indirect methods.
- **Scalable patterns.** Every new contract should follow the established pattern (constants → deploy script → tasks). One-off scripts are not acceptable.
- **Real-world focus.** Practice contracts should map to actual freelance gigs, not made-up scenarios.

### How to write episode documentation (`docs/E*.md`)

**Context:** The author is a BEGINNER learning Solidity. Documentation must be educational, not just reference material.

**Structure (mandatory sections):**

1. **"Чому це важливо?"** — Start with real-world context and analogies. Answer "why should I care?" before diving into technical details. Use everyday comparisons (building a house, warehouse vs desk, etc).

2. **Explain WHY, not just WHAT** — For every concept, explain:
   - What it is (brief technical definition)
   - Why it exists (what problem it solves)
   - When to use it (practical use-cases)
   - Real-world examples (freelance demand, common patterns, security implications)

3. **Structure: simple → complex** — Build concepts progressively. Don't assume prior knowledge beyond previous episodes.

4. **Use analogies and examples:**
   - Real-life comparisons for abstract concepts
   - Security incidents (with dates/names) for critical topics like overflow
   - Freelance/job market context where relevant

5. **Show practical differences:**
   - "Before Solidity 0.8.0" vs "After 0.8.0" (with consequences)
   - Gas costs (concrete numbers: "20,000 gas" not "expensive")
   - When to use X vs Y (with decision criteria)

6. **Code examples:**
   - Always include `solidity` syntax highlighting
   - Mark correct ✅ and incorrect ❌ approaches
   - Show both the pattern AND anti-pattern

7. **Testing section:**
   - Real commands the user will run
   - **CRITICAL:** Clearly separate Terminal 1 (blockchain) and Terminal 2 (deploy/tasks)
   - Explain that Terminal 1 must stay open while running commands in Terminal 2
   - Show expected output for key commands (deployment address, etc.)
   - Verify parameter names match actual task definitions (e.g., `--addr` not `--address`)
   - Group commands by feature, not in one long list

8. **"Важливі моменти для запам'ятовування"** — 3-5 critical takeaways with code snippets

9. **"Міні-вправи для закріплення"** — 2-3 small exercises to practice the concepts independently

10. **"Підсумок (що ти маєш винести)"** — Checklist of learning outcomes (✅ format)

**Tone:**
- Friendly, educational, not academic
- "Ти" (informal), not "ви" (formal)
- Explain jargon when first used
- Acknowledge what's confusing ("це ламає мозок новачкам, але...")

**What to avoid:**
- Bullet lists without explanation
- Tables with long content (breaks formatting)
- Assuming knowledge ("as you know...", "obviously...")
- Technical jargon without context
- Code dumps without explaining what/why
