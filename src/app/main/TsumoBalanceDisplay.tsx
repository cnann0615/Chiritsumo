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
    <div className="mb-16 mt-32 flex flex-col items-center text-2xl">
      <h3 className="mb-4 text-2xl font-semibold sm:mb-6 sm:text-5xl">残高</h3>
      <div className="mb-2 text-[100px] font-bold leading-none sm:mb-4 sm:text-[150px]">
        {/* メインの金額表示 */}
        {isLoading ? randomNumber : tsumoBalance?.tsumoBalance}
      </div>
      <div className="text-2xl font-semibold sm:text-5xl">円</div>
    </div>
  );
};

export default TsumoBalanceDisplay;
