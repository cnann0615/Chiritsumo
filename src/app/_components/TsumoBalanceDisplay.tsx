"use client";
import { api } from "~/trpc/react";

const TsumoBalanceDisplay = () => {
  const { data: tsumoBalance } = api.tsumoBalance.read.useQuery();
  return <div>{tsumoBalance?.tsumoBalance}</div>;
};

export default TsumoBalanceDisplay;
