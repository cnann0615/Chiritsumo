"use client";
import { WantedItem } from "@prisma/client";
import React from "react";
import { api } from "~/trpc/react";
import Button from "../components/Button";
import confetti from "canvas-confetti";

// 欲しいものリスト進捗コンポーネント
const BalanceProgress = () => {
  // キャッシュ更新用
  const utils = api.useUtils();

  // 欲しいものリスト取得
  const { data: wantedItemList } = api.wantedItem.read.useQuery();

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
      window.scrollTo({ top: 0, behavior: "smooth" });

      // クラッカーアニメーション
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#e7ff30", "#ffffff", "#a2a70b", "#000000"],
      });

      // 楽観的に残高表示の値を更新（キャッシュの編集）
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
        utils.balance.read.invalidate(); // エラーが出た場合、キャッシュを無効化してリセット
      }
    }
  };

  if (balance) {
    return (
      <div className="flex justify-center p-4 sm:p-6">
        <div className="w-full max-w-2xl">
          <h2 className="mb-4 mt-12 text-center text-xl font-bold sm:text-2xl">
            <span className="border-b-2 border-pink-500">
              欲しい物リスト進捗
            </span>
          </h2>
          {wantedItemList && wantedItemList.length > 0 ? (
            wantedItemList.map((item) => (
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
                          pending={false}
                        />
                      )}
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-2">
                    <progress
                      max="1"
                      value={balance!.balance / item.price}
                      className="w-full"
                    ></progress>
                    <p className="text-sm sm:text-base">
                      {Math.min(
                        Math.round((balance!.balance / item.price) * 100),
                        100,
                      )}
                      %
                    </p>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <p className="text-center text-gray-500">
              <p className="inline-block">欲しい物リストが空です。</p>
              <p className="inline-block">
                欲しい物ページからアイテムを追加してください。
              </p>
            </p>
          )}
        </div>
      </div>
    );
  }
};

export default BalanceProgress;
