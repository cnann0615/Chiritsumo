"use client";
import { HabitualWaste } from "@prisma/client";
import React, { useState } from "react";
import { api } from "~/trpc/react";

const HabitualWastedList = () => {
  const { data: habitualWasteList, refetch } =
    api.habitualWaste.read.useQuery();

  // 編集状態管理
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ title: string; tsumo: string }>({
    title: "",
    tsumo: "",
  });

  // ミューテーションを定義
  const updateHabitualWaste = api.habitualWaste.update.useMutation({
    onSuccess: async () => {
      await refetch(); // 更新成功後にデータを再取得
      setEditId(null); // 編集モードを解除
    },
  });
  const deleteHabitualWaste = api.habitualWaste.delete.useMutation({
    onSuccess: async () => {
      await refetch(); // 削除成功後にデータを再取得
    },
  });

  // 編集モード開始
  const handleEdit = (waste: HabitualWaste) => {
    setEditId(waste.id);
    setEditData({ title: waste.title, tsumo: waste.tsumo.toString() });
  };

  // 編集内容を保存
  const handleSave = (id: string) => {
    const habitualWasteValue =
      editData.tsumo === "" ? 0 : Number(editData.tsumo);
    updateHabitualWaste.mutate({
      id,
      ...{ title: editData.title, tsumo: habitualWasteValue },
    });
  };

  // 編集をキャンセル
  const handleCancel = () => {
    setEditId(null);
  };

  // 削除
  const handleDelete = (id: string) => {
    window.confirm("削除しますか？") && deleteHabitualWaste.mutate({ id });
  };

  return (
    <div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-black bg-opacity-10 text-left">
            <th className="p-3 font-semibold text-gray-200">タイトル</th>
            <th className="p-3 font-semibold text-gray-200">値段</th>
            <th className="p-3 font-semibold text-gray-200">アクション</th>
          </tr>
        </thead>
        <tbody>
          {habitualWasteList?.map((waste) => (
            <tr
              key={waste.id}
              className="border-b border-gray-500 bg-black bg-opacity-10"
            >
              <td className="p-3">
                {editId === waste.id ? (
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="rounded border bg-black bg-opacity-10 p-2 text-gray-100"
                  />
                ) : (
                  waste.title
                )}
              </td>
              <td className="p-3">
                {editId === waste.id ? (
                  <input
                    type="number"
                    value={editData.tsumo}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        tsumo: e.target.value,
                      }))
                    }
                    className="rounded border bg-black bg-opacity-10 p-2 text-gray-100"
                  />
                ) : (
                  waste.tsumo
                )}
              </td>
              <td className="space-x-2 p-3">
                {editId === waste.id ? (
                  <>
                    <button
                      onClick={() => handleSave(waste.id)}
                      className="rounded bg-green-600 px-2 py-1 text-white"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="rounded bg-gray-600 px-2 py-1 text-white"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(waste)}
                      className="rounded bg-blue-600 px-2 py-1 text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(waste.id)}
                      className="rounded bg-red-600 px-2 py-1 text-white"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HabitualWastedList;
