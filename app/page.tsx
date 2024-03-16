"use client";

import { contracts } from "@/blockchain/contracts";
import ConnectButton from "@/components/shared/ConnectButton";
import Card from "@/components/ui/Card";
import useETHBalance from "@/hooks/useETHBalance";
import useTokenData from "@/hooks/useTokenData";
import useWeb3 from "@/hooks/useWeb3";
import { shortenAddress } from "@/utils/common";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { SyntheticEvent, useState } from "react";
import { formatUnits, parseUnits } from "viem";
import { usePublicClient, useWriteContract } from "wagmi";

export default function Home() {
  const client = usePublicClient();
  const { address, isActive } = useWeb3();
  const { data: tokenData, invalidateTokenBalance } = useTokenData(
    contracts.ynETH.address
  );
  const ethBalance = useETHBalance();
  const { writeContract, isPending } = useWriteContract();

  const { open } = useWeb3Modal();

  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!client) {
      return;
    }

    if (!tokenData) {
      return;
    }

    if (!amount || Number.isNaN(amount)) {
      setError("Invalid amount");
    }

    const amountinWei = parseUnits(amount, Number(tokenData.tokenDecimals));

    if (amountinWei > ethBalance) {
      setError("Insufficient balance");
    }

    writeContract(
      {
        ...contracts.ynETH,
        functionName: "depositETH",
        args: [contracts.ynETH.address],
        value: amountinWei,
      },
      {
        onError: (error) => {
          alert(`Deposit Failed: ${error.message}`);
        },

        onSuccess: async (hash) => {
          const receipt = await client.waitForTransactionReceipt({ hash });

          if (receipt.status === "success") {
            alert(`Deposit Success, Transaction: ${receipt.transactionHash}`);
          }
          invalidateTokenBalance();
        },
      }
    );
  };

  const handleConnect = () => {};

  return (
    <main className="min-h-screen p-8 lg:px-24 lg:py-8">
      <header className="w-full">
        <nav className="flex justify-between">
          <div>ynETH</div>
          <div>
            {!isActive ? (
              <ConnectButton />
            ) : (
              <div
                className="bg-blue-500 px-4 py-2 text-white rounded-md cursor-pointer"
                role="button"
                onClick={() => open({ view: "Account" })}
              >
                {shortenAddress(address!)}
              </div>
            )}
          </div>
        </nav>
      </header>
      <section className="py-10 flex flex-col justify-center items-center">
        <h3 className="text-5xl text-center">YieldNest FE Test</h3>
        {address && (
          <h5 className="text-center mt-4">
            Your Address: <span>{shortenAddress(address)}</span>
          </h5>
        )}
        {tokenData && (
          <>
            <div className="mt-8 flex flex-col md:flex-row gap-4 lg:gap-8 jsutify-center items-center ">
              <Card className="flex flex-col gap-2 p-6 w-full flex-1">
                <span className="text-xl font-medium whitespace-nowrap">
                  Token Symbol
                </span>
                <span>{tokenData.symbol}</span>
              </Card>
              <Card className="flex flex-col gap-2 p-6 w-full flex-1">
                <span className="text-xl font-medium whitespace-nowrap">
                  Token Name
                </span>
                <span>{tokenData.tokenName}</span>
              </Card>
              <Card className="flex flex-col gap-2 p-6 w-full flex-1">
                <span className="text-xl font-medium whitespace-nowrap">
                  Token Decimals
                </span>
                <span>{tokenData.tokenDecimals.toString()}</span>
              </Card>
            </div>

            <div className="mt-4 lg:mt-8 text-xl font-medium">
              <p>
                User Balance:{" "}
                <span className="font-light">
                  {formatUnits(
                    tokenData?.userBalance || 0n,
                    Number(tokenData?.tokenDecimals || 18)
                  )}
                </span>
              </p>
              <p>
                Total Supply:{" "}
                <span className="font-light">
                  {Number(
                    formatUnits(
                      tokenData?.tokenSupply || 0n,
                      Number(tokenData?.tokenDecimals || 18)
                    )
                  ).toFixed(4)}
                </span>
              </p>
            </div>
            <div className="mt-20 w-fit">
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 ">
                <label>Deposit ETH</label>
                <input
                  type="text"
                  name="amount"
                  value={amount}
                  onChange={(e) => {
                    setError("");
                    setAmount(e.target.value);
                  }}
                  className="ring-1 ring-blue-500 h-10 min-w-[300px] rounded-md px-2"
                />
                {error && <p className="text-red-500">{error}</p>}
                <button
                  type="submit"
                  className="bg-blue-500 px-4 py-2 text-white rounded-md disabled:opacity-60"
                  disabled={!isActive || isPending}
                >
                  Deposit
                </button>
              </form>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
