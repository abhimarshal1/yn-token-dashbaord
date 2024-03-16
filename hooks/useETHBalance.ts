import { useBalance } from "wagmi";
import useWeb3 from "./useWeb3";

const useETHBalance = () => {
  const { address } = useWeb3();

  const { data } = useBalance({
    address,
  });

  return data ? data.value : 0n;
};

export default useETHBalance;
