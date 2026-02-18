import { CONTRACTS, ContractName } from "./contracts";

// Constructor args passed during deployment (empty array = no args)
export const CONSTRUCTOR_ARGS: Record<ContractName, unknown[]> = {
  [CONTRACTS.FirstContract]: [],
  [CONTRACTS.TypesDemo]: [],
};
