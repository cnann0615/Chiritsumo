"use client";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";

// 残高表示コンポーネント
const BalanceDisplay = () => {
  // 残高を取得
  const { data: balance, isLoading } = api.balance.read.useQuery();

  // 残高を取得中にランダムな数字をシャッフルして表示するアニメーションを表示
  // const [randomNumber, setRandomNumber] = useState(0);
  // useEffect(() => {
  //   if (isLoading) {
  //     const intervalId = setInterval(() => {
  //       setRandomNumber(Math.floor(Math.random() * 90 + 10));
  //     }, 50); // 100ミリ秒ごとにランダムな2桁の数字を生成
  //     return () => clearInterval(intervalId);
  //   }
  // }, [isLoading]);

  return (
    <div className="mb-16 mt-32 flex flex-col items-center text-2xl">
      <h3 className="mb-4 text-2xl font-bold sm:mb-6 sm:text-4xl">残高</h3>
      <div className="mb-2 text-[100px] font-bold leading-none sm:mb-4 sm:text-[150px]">
        {/* メインの金額表示 */}
        {isLoading ? (
          <div
            className="flex h-32 w-32 justify-center sm:h-40 sm:w-40"
            aria-label="読み込み中"
          >
            <div className="mt-3 h-20 w-20 animate-spin rounded-full border-4 border-pink-500 border-t-transparent sm:mt-4 sm:h-28 sm:w-28"></div>
          </div>
        ) : (
          <div className="flex h-28 w-28 justify-center sm:h-40 sm:w-40">
            {balance?.balance}
          </div>
        )}
      </div>
      <div className="text-4xl font-bold sm:text-5xl">JPY</div>
    </div>
  );
};

export default BalanceDisplay;
