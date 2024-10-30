"use client";
import { WantedItem } from "@prisma/client";
import React from "react";
import { api } from "~/trpc/react";

const TsumoBalanceProgress = () => {
  const utils = api.useUtils();
  const { data: wantedItemList } = api.wantedItem.read.useQuery();
  const { data: tsumoBalance } = api.tsumoBalance.read.useQuery();

  // ミューテーションを定義
  const updateTsumoBalance = api.tsumoBalance.update.useMutation({
    onSuccess: async () => {
      await utils.tsumoBalance.read.invalidate();
    },
  });
  const deleteWantedItem = api.wantedItem.delete.useMutation({
    onSuccess: async () => {
      await utils.wantedItem.read.invalidate();
    },
  });

  const handleBuy = async (item: WantedItem) => {
    if (window.confirm("つも残高をこの商品に使いますか？")) {
      updateTsumoBalance.mutate({ tsumo: -item.price });
      deleteWantedItem.mutate({ id: item.id });
    }
  };

  if (tsumoBalance) {
    return (
      <div className="my-10 flex justify-center p-4 sm:p-6">
        <div className="w-full max-w-2xl">
          <h2 className="my-4 text-center text-xl font-bold sm:text-2xl">
            欲しい物リスト進捗
          </h2>
          {wantedItemList && wantedItemList.length > 0 ? (
            wantedItemList.map((item) => (
              <article
                key={item.id}
                className="mb-4 rounded border border-gray-500 bg-gray-900 p-4 shadow-xl"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
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
                    <div className="mt-2 flex items-center gap-2">
                      <progress
                        max="1"
                        value={tsumoBalance!.tsumoBalance / item.price}
                        className="w-full sm:w-2/3"
                      ></progress>
                      <p className="text-sm sm:text-base">
                        {Math.min(
                          Math.round(
                            (tsumoBalance!.tsumoBalance / item.price) * 100,
                          ),
                          100,
                        )}
                        %
                      </p>
                    </div>
                  </div>
                  {tsumoBalance!.tsumoBalance / item.price >= 1 && (
                    <button
                      onClick={() => handleBuy(item)}
                      className="mt-3 w-full rounded bg-purple-900 px-4 py-2 text-white sm:mt-0 sm:w-auto"
                    >
                      購入できます！
                    </button>
                  )}
                </div>
              </article>
            ))
          ) : (
            <p className="text-center text-gray-500">
              欲しい物リストが空です。リストにアイテムを追加してください。
            </p>
          )}
        </div>
      </div>
    );
  }
};

export default TsumoBalanceProgress;
