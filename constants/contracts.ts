export const CONTRACTS = {
  FirstContract: "FirstContract",
  TypesDemo: "TypesDemo",
  DataStructures: "DataStructures",
} as const;

export type ContractName = (typeof CONTRACTS)[keyof typeof CONTRACTS];
