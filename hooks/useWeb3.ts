"use client";

import { Web3Context } from "@/providers/Web3Provider";
import { useContext } from "react";

const useWeb3 = () => {
  const data = useContext(Web3Context);

  return data;
};

export default useWeb3;
