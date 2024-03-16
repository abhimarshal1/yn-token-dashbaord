import { Abi, Hash } from "viem";

import abi from "@/blockchain/contracts/ynETH/abi.json";

export const contracts = {
  ynETH: {
    address: "0x0091626e15caFd0F6Bc96dE7F12CEe444c0a212d" as Hash,
    abi: abi as Abi,
  },
};
