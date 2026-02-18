export const CONTRACTS = {
  FirstContract: "FirstContract",
  TypesDemo: "TypesDemo",
} as const;

export type ContractName = (typeof CONTRACTS)[keyof typeof CONTRACTS];
