import { Hash } from "viem";
import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const shortenAddress = (address: Hash) =>
  `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
