import { Balance, WantedItem } from "@prisma/client";
import React from "react";

// 進捗バー（欲しいものの額に対する残高の割合をProgressBarで示す）
const ProgressBar = ({
  item,
  balance,
}: {
  item: WantedItem;
  balance: Balance;
}) => {
  return (
    <div className="mt-2 flex items-center gap-2">
      <progress
        max="1"
        value={balance!.balance / item.price}
        className="w-full"
      ></progress>
      <p className="text-sm sm:text-base">
        {Math.min(Math.round((balance!.balance / item.price) * 100), 100)}%
      </p>
    </div>
  );
};

export default ProgressBar;
