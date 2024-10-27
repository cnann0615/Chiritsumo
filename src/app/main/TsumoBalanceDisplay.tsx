"use client";
import { api } from "~/trpc/react";

const TsumoBalanceDisplay = () => {
  const { data: tsumoBalance } = api.tsumoBalance.read.useQuery();

  return (
    <div className="flex flex-col items-center text-2xl">
      <div className="flex h-48 items-center justify-center text-7xl font-bold sm:h-60 sm:text-[150px]">
        {/* メインの金額表示 */}
        {tsumoBalance?.tsumoBalance}
        <div>
          <span className="text-3xl sm:text-5xl">円</span>
        </div>
      </div>
    </div>
  );
};

export default TsumoBalanceDisplay;
