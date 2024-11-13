"use client";
import React from "react";
import { api } from "~/trpc/react";
import BalanceProgressItem from "./BalanceProgressItem";
import LoadingRing from "../_components/LoadingRing";

// 欲しいものリスト進捗コンポーネント
const BalanceProgress = () => {
  // 欲しいものリスト取得
  const { data: wantedItemList, isLoading } = api.wantedItem.read.useQuery();

  return isLoading ? (
    <LoadingRing />
  ) : (
    <div className="flex justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        <h2 className="mb-4 mt-12 text-center text-xl font-bold sm:text-2xl">
          <span className="border-b-2 border-pink-500">欲しい物リスト進捗</span>
        </h2>
        {wantedItemList && wantedItemList.length > 0 ? (
          wantedItemList.map((item) => (
            <BalanceProgressItem key={item.id} item={item} />
          ))
        ) : (
          <div className="text-center text-gray-500">
            <p className="inline-block">欲しい物リストが空です。</p>
            <p className="inline-block">
              欲しい物ページからアイテムを追加してください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BalanceProgress;
