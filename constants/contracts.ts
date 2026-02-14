export const CONTRACTS = {
  FirstContract: "FirstContract",
} as const;

export type ContractName = (typeof CONTRACTS)[keyof typeof CONTRACTS];
