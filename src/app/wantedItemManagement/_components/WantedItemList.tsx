"use client";
import { WantedItem } from "@prisma/client";
import React, { useState } from "react";
import { api } from "~/trpc/react";
import LoadingRing from "~/app/_components/LoadingRing";
import Row from "./Row";
import EditItemModal from "./EditItemModal";

// 欲しいものリストコンポーネント
const WantedItemList = () => {
  // キャッシュ更新用
  const utils = api.useUtils();

  // 欲しいものリスト取得
  const { data: wantedItemList, isLoading } = api.wantedItem.read.useQuery();

  // 欲しいものリスト編集用
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

  // モーダル開閉管理用
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ミューテーションを定義
  const updateWantedItem = api.wantedItem.update.useMutation({
    onSuccess: async () => {
      await utils.wantedItem.read.invalidate();
      setEditId(null);
    },
  });
  const deleteWantedItem = api.wantedItem.delete.useMutation({
    onSuccess: async () => {
      await utils.wantedItem.read.invalidate();
    },
  });

  // ハンドラ

  // 欲しいものリスト編集開始
  const handleEdit = (wantedItem: WantedItem) => {
    setEditId(wantedItem.id);
    setEditData({
      name: wantedItem.name,
      price: wantedItem.price.toString(),
      url: wantedItem.url ? wantedItem.url : "",
    });
    setIsModalOpen(true);
  };

  // 編集内容保存
  const handleSave = async () => {
    if (editId) {
      const wantedItemPrice =
        editData.price === "" ? 0 : Number(editData.price);
      const wantedItemURL = editData.url === "" ? null : editData.url;

      // 楽観的更新
      utils.wantedItem.read.setData(undefined, (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((item) =>
          item.id === editId
            ? {
                ...item,
                name: editData.name,
                price: wantedItemPrice,
                url: wantedItemURL,
              }
            : item,
        );
      });

      setIsModalOpen(false);

      try {
        updateWantedItem.mutate({
          id: editId,
          name: editData.name,
          price: wantedItemPrice,
          url: wantedItemURL,
        });
      } catch (error) {
        console.error("Error updating balance or creating log:", error);
        window.alert(
          "データの更新中に問題が発生しました。もう一度お試しください。",
        );
        utils.wantedItem.read.invalidate();
      }
    }
  };

  // 編集キャンセル
  const handleCancel = () => {
    setEditId(null);
    setIsModalOpen(false);
  };

  // 欲しいものリスト削除
  const handleDelete = async (id: string) => {
    if (window.confirm("削除しますか？")) {
      utils.wantedItem.read.setData(undefined, (oldData) => {
        if (!oldData) return oldData;
        return oldData.filter((item) => item.id !== id);
      });
      try {
        deleteWantedItem.mutate({ id });
      } catch (error) {
        console.error("Error updating balance or creating log:", error);
        window.alert(
          "データの削除中に問題が発生しました。もう一度お試しください。",
        );
        utils.wantedItem.read.invalidate();
      }
    }
  };

  return (
    <div>
      <h2 className="mb-4 pl-1 text-xl font-bold text-gray-100 sm:text-2xl">
        欲しい物リスト
      </h2>
      {isLoading ? (
        <LoadingRing />
      ) : (
        <div>
          {wantedItemList && wantedItemList.length > 0 ? (
            wantedItemList.map((item) => (
              <Row
                key={item.id}
                item={item}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="text-center text-gray-500">
              <p>欲しい物リストが空です。新しいアイテムを追加してください。</p>
            </div>
          )}
        </div>
      )}
      <EditItemModal
        isOpen={isModalOpen}
        onClose={handleCancel}
        editData={editData}
        setEditData={setEditData}
        onSave={handleSave}
      />
    </div>
  );
};

export default WantedItemList;
