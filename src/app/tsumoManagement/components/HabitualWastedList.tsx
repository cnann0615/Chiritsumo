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
      await refetch();
      setEditId(null);
    },
  });
  const deleteHabitualWaste = api.habitualWaste.delete.useMutation({
    onSuccess: async () => {
      await refetch();
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
    <div className="overflow-x-auto px-4">
      <table className="w-full border-collapse text-left text-sm sm:text-base">
        <thead>
          <tr className="bg-black bg-opacity-30">
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
                    className="w-full rounded border bg-black bg-opacity-10 p-2 text-gray-100"
                    placeholder="タイトル"
                  />
                ) : (
                  <span className="block sm:table-cell">{waste.title}</span>
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
                    className="w-full rounded border bg-black bg-opacity-10 p-2 text-gray-100"
                    placeholder="値段"
                  />
                ) : (
                  <span className="block sm:table-cell">{waste.tsumo}</span>
                )}
              </td>
              <td className="p-3">
                <div className="flex flex-wrap gap-2">
                  {editId === waste.id ? (
                    <>
                      <button
                        onClick={() => handleSave(waste.id)}
                        className="w-full rounded bg-green-600 px-2 py-1 text-white sm:w-auto"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="w-full rounded bg-gray-600 px-2 py-1 text-white sm:w-auto"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEdit(waste)}
                        className="w-full rounded bg-pink-500 px-2 py-1 text-white sm:w-auto"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(waste.id)}
                        className="w-full rounded bg-gray-700 px-2 py-1 text-white sm:w-auto"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HabitualWastedList;