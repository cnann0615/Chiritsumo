"use client";
import { WantedItem } from "@prisma/client";
import React, { useState } from "react";
import { api } from "~/trpc/react";

const WantedItemList = () => {
  const { data: wantedItemList, refetch } = api.wantedItem.read.useQuery();
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{
    name: string;
    price: string;
    url: string;
  }>({
    name: "",
    price: "",
    url: "",
  });

  // ミューテーションを定義
  const updateWantedItem = api.wantedItem.update.useMutation({
    onSuccess: async () => {
      await refetch();
      setEditId(null);
    },
  });
  const deleteWantedItem = api.wantedItem.delete.useMutation({
    onSuccess: async () => {
      await refetch();
    },
  });

  // 編集モード開始
  const handleEdit = (wantedItem: WantedItem) => {
    setEditId(wantedItem.id);
    setEditData({
      name: wantedItem.name,
      price: wantedItem.price.toString(),
      url: wantedItem.url,
    });
  };

  // 編集内容を保持
  const handleSave = async (id: string) => {
    const wantedItemPrice = editData.price === "" ? 0 : Number(editData.price);
    updateWantedItem.mutate({
      id,
      ...{
        name: editData.name,
        price: wantedItemPrice,
        url: editData.url,
      },
    });
  };

  // 編集をキャンセル
  const handleCancel = () => {
    setEditId(null);
  };

  // 削除
  const handleDelete = async (id: string) => {
    window.confirm("削除しますか？") && deleteWantedItem.mutate({ id });
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold text-gray-100 sm:text-2xl">
        欲しい物リスト
      </h2>
      {wantedItemList && wantedItemList.length > 0 ? (
        wantedItemList.map((item) => (
          <article
            key={item.id}
            className="mb-4 flex flex-col items-start gap-4 rounded border border-gray-500 bg-gray-900 p-4 shadow-xl sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="w-full flex-1">
              {editId === item.id ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full rounded border bg-black bg-opacity-10 px-2 py-1 text-gray-100"
                    placeholder="商品名"
                  />
                  <input
                    type="number"
                    value={editData.price}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        price: e.target.value,
                      }))
                    }
                    className="w-full rounded border bg-black bg-opacity-10 px-2 py-1 text-gray-100"
                    placeholder="価格"
                  />
                  <input
                    type="url"
                    value={editData.url}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        url: e.target.value,
                      }))
                    }
                    className="w-full rounded border bg-black bg-opacity-10 px-2 py-1 text-gray-100"
                    placeholder="URL"
                  />
                </div>
              ) : (
                <div>
                  <div className="flex items-end gap-3">
                    <h3 className="text-lg font-semibold text-gray-100">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-300 sm:text-base">
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
              )}
            </div>
            <div className="flex gap-2">
              {editId === item.id ? (
                <>
                  <button
                    onClick={() => handleSave(item.id)}
                    className="w-full rounded bg-green-500 px-4 py-2 text-white sm:w-auto"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="w-full rounded bg-gray-400 px-4 py-2 text-white sm:w-auto"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleEdit(item)}
                    className="w-full rounded bg-pink-500 px-4 py-2 text-white sm:w-auto"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="w-full rounded bg-gray-700 px-4 py-2 text-white sm:w-auto"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </article>
        ))
      ) : (
        <p className="text-center text-gray-500">
          <div className="inline-block">欲しい物リストが空です。</div>
          <div className="inline-block">新しいアイテムを追加してください。</div>
        </p>
      )}
    </div>
  );
};

export default WantedItemList;
