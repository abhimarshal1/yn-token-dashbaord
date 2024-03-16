"use client";

import React, { ReactNode } from "react";
import { config, projectId } from "@/blockchain/configs/wagmi";

import { createWeb3Modal } from "@web3modal/wagmi/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { State, WagmiProvider } from "wagmi";
import Web3Provider from "./Web3Provider";

// Setup queryClient
const queryClient = new QueryClient();

if (!projectId) throw new Error("Project ID is not defined");

// Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  themeMode: 'light',
});

export default function AppProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: State;
}) {
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        <Web3Provider>{children}</Web3Provider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
