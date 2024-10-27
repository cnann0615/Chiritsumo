"use client";
import { api } from "~/trpc/react";

const TsumoBalanceDisplay = () => {
  const { data: tsumoBalance } = api.tsumoBalance.read.useQuery();
  return (
    <>
      <div className="flex h-60 items-center justify-center text-9xl font-bold">
        {tsumoBalance?.tsumoBalance}
        <div>
          <span className="text-5xl">円</span>
        </div>
      </div>
    </>
  );
};

export default TsumoBalanceDisplay;
