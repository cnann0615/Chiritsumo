"use client";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";

const TsumoBalanceDisplay = () => {
  const { data: tsumoBalance, isLoading } = api.tsumoBalance.read.useQuery();
  const [randomNumber, setRandomNumber] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const intervalId = setInterval(() => {
        setRandomNumber(Math.floor(Math.random() * 90 + 10));
      }, 10); // 100ミリ秒ごとにランダムな2桁の数字を生成
      return () => clearInterval(intervalId);
    }
  }, [isLoading]);

  return (
    <div className="flex flex-col items-center text-2xl">
      <div className="flex h-48 items-center justify-center pt-4 text-[100px] font-bold sm:h-60 sm:text-[150px]">
        {/* メインの金額表示 */}
        {isLoading ? randomNumber : tsumoBalance?.tsumoBalance}
        <div>
          <span className="text-3xl sm:text-5xl">円</span>
        </div>
      </div>
    </div>
  );
};

export default TsumoBalanceDisplay;
