import { Abi, Hash } from "viem";

import abi from "@/blockchain/contracts/ynETH/abi.json";

export const contracts = {
  ynETH: {
    address: "0xE328dE37dD1F30bb83a2850C86B7A47f7cfCdbB7" as Hash,
    abi: abi as Abi,
  },
};
