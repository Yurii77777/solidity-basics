# Project: Solidity Basics — YouTube Learning Series

## What this is

A learning project for Solidity smart contract development. The author (@yu_dev01) is learning Solidity and recording short 5-10 min YouTube episodes. Each episode adds a new contract or concept, progressively building real-world skills.

The full learning plan is in `docs/learning_plan.md`. It's built around real freelance demand — ERC-20 tokens, staking, NFT, DeFi patterns — not theoretical exercises.

## Current state

**Completed:** E1 (setup + first contract), E2 (migration to Hardhat + TypeScript).

**Current contract:** `contracts/firstContract.sol` — simple string storage + setter. This is the E1 learning artifact, kept as-is.

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
yarn node                    # start local blockchain (terminal 1)
yarn compile                 # compile + TypeChain types
yarn deploy:first            # deploy FirstContract to localhost
npx hardhat <task> --network localhost   # run a task
yarn test                    # run tests
```

## Rules for AI assistants

- **Language:** Documentation and notes (`docs/`) are written in Ukrainian. Code comments in English — tiny, concise, only where not self-evident.
- **No premature work.** Don't create contracts, docs, or infrastructure for future episodes unless explicitly asked. Each episode is done step by step.
- **No over-commenting.** Code should be self-explanatory. Add comments only for non-obvious things.
- **No magic strings.** All contract names go through `constants/`.
- **Test through actual workflow.** Verify via `yarn` scripts and `npx hardhat` tasks, not by running hardhat directly with grep or other indirect methods.
- **Keep docs concise.** No tables with long cells (they break formatting). Use bold headers + inline text instead.
- **Don't duplicate code in docs.** Code files have their own comments. Docs describe what/why, not how line by line.
- **Scalable patterns.** Every new contract should follow the established pattern (constants → deploy script → tasks). One-off scripts are not acceptable.
- **Real-world focus.** Practice contracts should map to actual freelance gigs, not made-up scenarios.
