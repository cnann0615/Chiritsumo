"use client";
import React from "react";
import { api } from "~/trpc/react";

const TsumoBalanceProgress = () => {
  const { data: wantedItemList, refetch } = api.wantedItem.read.useQuery();

  return (
    <div className="flex justify-center">
      <div className="w-[700px]">
        <h2 className="mb-4 text-2xl font-bold">つも進捗</h2>
        {wantedItemList?.map((item) => (
          <article
            key={item.id}
            className="mb-4 flex items-start space-x-4 rounded border border-gray-500 bg-gray-900 p-4 shadow-xl"
          >
            <div>
              <div className="flex items-end gap-3">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-500">Price: ¥{item.price}</p>
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
          </article>
        ))}
      </div>
    </div>
  );
};

export default TsumoBalanceProgress;
