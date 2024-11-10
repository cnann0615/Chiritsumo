"use client";
import { WantedItem } from "@prisma/client";
import React, { useState } from "react";
import Button from "~/app/components/Button";
import { api } from "~/trpc/react";
import EditModal from "~/app/components/EditModal"; // モーダルコンポーネントをインポート

// 欲しいものリストコンポーネント
const WantedItemList = () => {
  // キャッシュ更新用
  const utils = api.useUtils();
  // 欲しいものリスト取得
  const { data: wantedItemList, isLoading } = api.wantedItem.read.useQuery();
  // 編集中のアイテムのIDを管理
  const [editId, setEditId] = useState<string | null>(null);
  // 編集の内容を管理
  const [editData, setEditData] = useState<{
    name: string;
    price: string;
    url: string;
  }>({
    name: "",
    price: "",
    url: "",
  });
  // 削除中のアイテムのIDを管理
  const [deleteId, setDeleteId] = useState<string | null>(null);
  // モーダルの開閉状態を管理
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ミューテーションを定義
  const updateWantedItem = api.wantedItem.update.useMutation({
    onSuccess: async () => {
      await utils.wantedItem.read.invalidate();
      setEditId(null);
      setIsModalOpen(false);
    },
  });
  const deleteWantedItem = api.wantedItem.delete.useMutation({
    onSuccess: async () => {
      await utils.wantedItem.read.invalidate();
      setDeleteId(null);
    },
  });

  // イベント
  const handleEdit = (wantedItem: WantedItem) => {
    setEditId(wantedItem.id);
    setEditData({
      name: wantedItem.name,
      price: wantedItem.price.toString(),
      url: wantedItem.url ? wantedItem.url : "",
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (editId) {
      const wantedItemPrice =
        editData.price === "" ? 0 : Number(editData.price);
      const wantedItemURL = editData.url === "" ? null : editData.url;
      updateWantedItem.mutate({
        id: editId,
        name: editData.name,
        price: wantedItemPrice,
        url: wantedItemURL,
      });
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("削除しますか？")) {
      setDeleteId(id);
      deleteWantedItem.mutate({ id });
    }
  };

  return (
    <div>
      <h2 className="mb-4 pl-1 text-xl font-bold text-gray-100 sm:text-2xl">
        欲しい物リスト
      </h2>
      {isLoading ? (
        <div className="flex justify-center" aria-label="読み込み中">
          <div className="mt-3 h-20 w-20 animate-spin rounded-full border-4 border-pink-500 border-t-transparent sm:mt-4 sm:h-28 sm:w-28"></div>
        </div>
      ) : (
        <div>
          {wantedItemList && wantedItemList.length > 0 ? (
            wantedItemList.map((item) => (
              <article
                key={item.id}
                className="mb-4 flex items-center justify-between gap-4 rounded border border-gray-500 bg-gray-900 p-4 shadow-xl"
              >
                <div className="w-full flex-1">
                  <div>
                    <div className="flex items-end gap-3">
                      <h3 className="text-lg font-semibold text-gray-100">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-300 sm:text-base">
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
                </div>
                <div>
                  <div className="flex-col space-y-2">
                    <Button
                      text={"✏️"}
                      size={"xSmall"}
                      bgColor={"pink"}
                      onClick={() => handleEdit(item)}
                      pending={false}
                    />
                    <Button
                      text={"🗑️"}
                      size={"xSmall"}
                      bgColor={"gray"}
                      onClick={() => handleDelete(item.id)}
                      pending={deleteId === item.id}
                    />
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="text-center text-gray-500">
              <p>欲しい物リストが空です。新しいアイテムを追加してください。</p>
            </div>
          )}
        </div>
      )}

      {/* 編集モーダル */}
      <EditModal isOpen={isModalOpen} onClose={handleCancel}>
        <h2 className="mb-4 text-lg font-bold">アイテムを編集</h2>
        <div className="mb-4">
          <label className="block text-gray-400">商品名</label>
          <input
            type="text"
            value={editData.name}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full rounded border bg-black bg-opacity-10 px-2 py-1 text-gray-100"
            placeholder="商品名"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-400">価格</label>
          <input
            type="number"
            value={editData.price}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, price: e.target.value }))
            }
            className="w-full rounded border bg-black bg-opacity-10 px-2 py-1 text-gray-100"
            placeholder="価格"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-400">URL</label>
          <input
            type="url"
            value={editData.url}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, url: e.target.value }))
            }
            className="w-full rounded border bg-black bg-opacity-10 px-2 py-1 text-gray-100"
            placeholder="URL"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            text={"Save"}
            size={"small"}
            bgColor={"green"}
            onClick={handleSave}
            pending={updateWantedItem.isPending}
          />
          <Button
            text={"Cancel"}
            size={"small"}
            bgColor={"gray"}
            onClick={handleCancel}
            pending={false}
          />
        </div>
      </EditModal>
    </div>
  );
};

export default WantedItemList;
