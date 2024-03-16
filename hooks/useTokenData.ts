import { Hash, erc20Abi } from "viem";
import { useReadContract, useReadContracts } from "wagmi";

import useWeb3 from "./useWeb3";
import { useQueryClient } from "@tanstack/react-query";

const functionNames = [
  { fn: "decimals", label: "tokenDecimals", isNumber: true },
  { fn: "name", label: "tokenName", isNumber: false },
  { fn: "symbol", label: "symbol", isNumber: false },
  { fn: "totalSupply", label: "tokenSupply", isNumber: true },
];

type ResultType = {
  address: Hash;
  tokenDecimals: bigint;
  tokenName: string;
  symbol: string;
  tokenSupply: bigint;
  userBalance: bigint;
};

const useTokenData = (address: Hash) => {
  const queryClient = useQueryClient();
  const { address: userAddress } = useWeb3();

  const { data: userBalance, queryKey } = useReadContract({
    address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [userAddress as Hash],
    query: {
      enabled: !!userAddress,
    },
  });

  const { data } = useReadContracts({
    contracts: functionNames.map(({ fn }) => ({
      address,
      abi: erc20Abi,
      functionName: fn,
    })),
    query: {
      enabled: !!address,
    },
  });

  const invalidateTokenBalance = () => {
    queryClient.invalidateQueries({ queryKey });
  };

  if (!data) return { data: undefined, invalidateTokenBalance };

  const tokenData = {
    tokenAddress: address,
    ...functionNames.reduce((acc, curr, index) => {
      const { result, error } = data[index];
      const { label, isNumber } = curr;

      if (error) {
        return { ...acc, [label]: isNumber ? 0n : "" };
      }

      return { ...acc, [label]: result };
    }, {}),
    userBalance: userBalance || 0n,
  } as unknown as ResultType;

  return { data: tokenData, invalidateTokenBalance };
};

export default useTokenData;
