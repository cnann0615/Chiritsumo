"use client";
import { Balance, WantedItem } from "@prisma/client";
import React from "react";
import Button from "../_components/Button";
import { api } from "~/trpc/react";
import confetti from "canvas-confetti";
import ProgressBar from "./ProgressBar";

const BalanceProgressItem = ({ item }: { item: WantedItem }) => {
  // キャッシュ更新用
  const utils = api.useUtils();
  // 残高取得
  const { data: balance } = api.balance.read.useQuery();

  // ミューテーションを定義
  const buyWantedItem = api.wantedItem.buy.useMutation({
    onSuccess: async () => {
      await utils.wantedItem.read.invalidate();
      await utils.balance.read.invalidate();
    },
  });

  // イベント
  const handleBuy = async (item: WantedItem) => {
    if (window.confirm("残高をこの商品に使いますか？")) {
      window.scrollTo({ top: 0 });

      // クラッカーアニメーション
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#e7ff30", "#ffffff", "#a2a70b", "#000000"],
      });

      // 楽観的に残高表示の値を更新（キャッシュの手動更新）
      utils.balance.read.setData(undefined, (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          balance: oldData.balance - Number(item.price),
        };
      });
      // 楽観的に欲しいものリストからアイテムを削除
      utils.wantedItem.read.setData(undefined, (oldData) => {
        if (!oldData) return oldData;
        return oldData.filter((wantedItem) => wantedItem.id !== item.id);
      });
      try {
        buyWantedItem.mutate({ id: item.id });
      } catch (error) {
        console.error("Error updating balance or creating log:", error);
        window.alert(
          "データの更新中に問題が発生しました。もう一度お試しください。",
        );
        utils.balance.read.invalidate(); // エラーが出た場合、キャッシュを無効化（再取得）してリセット
        utils.wantedItem.read.invalidate(); // エラーが出た場合、キャッシュを無効化（再取得）してリセット
      }
    }
  };

  if (balance) {
    return (
      <article
        key={item.id}
        className="mb-4 rounded border border-gray-500 bg-gray-900 p-4 shadow-xl"
      >
        <div>
          <div className="flex justify-between">
            <div>
              <div className="flex items-end gap-2 sm:gap-3">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-gray-500 sm:text-base">
                  Price: ¥{item.price}
                </p>
              </div>
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  詳細を見る
                </a>
              )}
            </div>
            <div>
              {/* 進捗が100％以上の時のみ、購入ボタンを表示 */}
              {balance!.balance / item.price >= 1 && (
                <Button
                  text={"購入！"}
                  size={"medium"}
                  bgColor={"pink"}
                  onClick={() => handleBuy(item)}
                />
              )}
            </div>
          </div>
          <ProgressBar item={item} balance={balance} />
        </div>
      </article>
    );
  }
};

export default BalanceProgressItem;
