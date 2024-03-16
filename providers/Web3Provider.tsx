"use client";

import { ReactNode, createContext } from "react";
import { Hash } from "viem";
import { useAccount } from "wagmi";

type ValueType = {
  address: Hash | undefined;
  chainId: number | undefined;
  isActive: boolean;
};

const initialData: ValueType = {
  address: undefined,
  chainId: undefined,
  isActive: false,
};

export const Web3Context = createContext<ValueType>(initialData);

const Web3Provider = ({ children }: { children: ReactNode }) => {
  const { address, chainId, isConnected } = useAccount();

  return (
    <Web3Context.Provider
      value={{
        address,
        chainId,
        isActive: isConnected,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export default Web3Provider;
