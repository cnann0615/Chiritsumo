"use client";
import { WantedItem } from "@prisma/client";
import React from "react";
import { api } from "~/trpc/react";
import Button from "../components/Button";

// 欲しいものリスト進捗コンポーネント
const BalanceProgress = () => {
  // キャッシュ更新用
  const utils = api.useUtils();

  // 欲しいものリスト取得
  const { data: wantedItemList } = api.wantedItem.read.useQuery();

  // 残高取得
  const { data: balance } = api.balance.read.useQuery();

  // ミューテーションを定義
  const updateBalance = api.balance.update.useMutation({
    onSuccess: async () => {
      await utils.balance.read.invalidate();
    },
  });
  const deleteWantedItem = api.wantedItem.delete.useMutation({
    onSuccess: async () => {
      await utils.wantedItem.read.invalidate();
    },
  });

  // イベント
  const handleBuy = async (item: WantedItem) => {
    if (window.confirm("つも残高をこの商品に使いますか？")) {
      updateBalance.mutate({ balance: -item.price });
      deleteWantedItem.mutate({ id: item.id });
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
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                      >
                        詳細を見る
                      </a>
                    </div>
                    <div>
                      {/* 進捗が100％以上の時のみ、購入ボタンを表示 */}
                      {balance!.balance / item.price >= 1 && (
                        <Button
                          text={"購入できます！"}
                          size={"medium"}
                          bgColor={"pink"}
                          onClick={() => handleBuy(item)}
                          pending={deleteWantedItem.isPending}
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
