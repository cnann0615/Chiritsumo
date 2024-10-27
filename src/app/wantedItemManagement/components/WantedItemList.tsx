"use client";
import { WantedItem } from "@prisma/client";
import { OgObject } from "open-graph-scraper/types";
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
      <h2 className="mb-4 text-2xl font-bold">欲しい物リスト</h2>
      {wantedItemList?.map((item) => (
        <article
          key={item.id}
          className="mb-4 flex items-start justify-between space-x-4 rounded border border-gray-500 bg-gray-900 p-4 shadow-xl"
        >
          <div className="flex-1">
            {editId === item.id ? (
              <div>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="mb-2 w-full rounded border bg-black bg-opacity-10 px-2 py-1"
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
                  className="mb-2 w-full rounded border bg-black bg-opacity-10 px-2 py-1"
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
                  className="mb-2 w-full rounded border bg-black bg-opacity-10 px-2 py-1"
                />
              </div>
            ) : (
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
            )}
          </div>
          <div className="flex flex-shrink-0 gap-2">
            {editId === item.id ? (
              <>
                <button
                  onClick={() => handleSave(item.id)}
                  className="rounded bg-green-500 px-4 py-2 text-white"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditId(null)}
                  className="rounded bg-gray-400 px-4 py-2 text-white"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleEdit(item)}
                  className="rounded bg-blue-600 px-4 py-2 text-white"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="rounded bg-red-500 px-4 py-2 text-white"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </article>
      ))}
    </div>
  );
};

export default WantedItemList;
