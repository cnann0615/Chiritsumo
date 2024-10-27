"use client";
import { TsumoLog } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { api } from "~/trpc/react";

const formattedDate = (date: Date): string => {
  return date.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const TsumoLogList = () => {
  // refetchを取得し、データの更新に応じてキャッシュを再取得し、タイムリーに画面を更新できるようにする。
  const { data: tsumoList, refetch } = api.tsumoLog.read.useQuery();
  const utils = api.useUtils();
  const [editId, setEditId] = useState<string | null>(null);
  const [preEditData, setPreEditData] = useState<{
    title: string;
    tsumo: number;
  }>({
    title: "",
    tsumo: 0,
  });
  const [editData, setEditData] = useState<{ title: string; tsumo: string }>({
    title: "",
    tsumo: "",
  });
  //  ミューテーションを定義
  const updateTsumoLog = api.tsumoLog.update.useMutation({
    onSuccess: async () => {
      updateTsumoBalance.mutate({ tsumo: -preEditData.tsumo });
      updateTsumoBalance.mutate({ tsumo: Number(editData.tsumo) });
      await utils.tsumoBalance.read.invalidate();
      await refetch();
    },
  });
  const deleteTsumoLog = api.tsumoLog.delete.useMutation({
    onSuccess: async (tsumo) => {
      updateTsumoBalance.mutate({ tsumo: -tsumo.tsumo });
      await utils.tsumoBalance.read.invalidate();
      await refetch();
    },
  });
  const updateTsumoBalance = api.tsumoBalance.update.useMutation({
    onSuccess: async () => {},
  });

  // 編集モードを開始
  const handleEdit = (tsumo: TsumoLog) => {
    setEditId(tsumo.id);
    setPreEditData({ title: tsumo.title, tsumo: Number(tsumo.tsumo) });
    setEditData({ title: tsumo.title, tsumo: tsumo.tsumo.toString() });
  };

  // 編集内容を保存
  const handleSave = async (id: string) => {
    const tsumoValue = editData.tsumo === "" ? 0 : Number(editData.tsumo);
    updateTsumoLog.mutate({
      id,
      ...{
        title: editData.title,
        tsumo: tsumoValue,
      },
    });
    setEditId(null);
  };

  // 編集をキャンセル
  const handleCancel = () => {
    setEditId(null);
  };

  // ログを削除
  const handleDelete = async (id: string) => {
    window.confirm("本当に削除しますか？") && deleteTsumoLog.mutate({ id });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-100">つもログ</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-black bg-opacity-10 text-left">
            <th className="p-3 font-semibold text-gray-200">タイトル</th>
            <th className="p-3 font-semibold text-gray-200">値段</th>
            <th className="p-3 font-semibold text-gray-200">日時</th>
            <th className="p-3 font-semibold text-gray-200">アクション</th>
          </tr>
        </thead>
        <tbody>
          {tsumoList?.map((tsumo) => (
            <tr
              key={tsumo.id}
              className="border-b border-gray-500 bg-black bg-opacity-10"
            >
              <td className="p-3">
                {editId === tsumo.id ? (
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="rounded border bg-black bg-opacity-10 p-1 text-gray-100"
                  />
                ) : (
                  tsumo.title
                )}
              </td>
              <td className="p-3">
                {editId === tsumo.id ? (
                  <input
                    type="number"
                    value={editData.tsumo}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        tsumo: e.target.value,
                      }))
                    }
                    className="rounded border bg-black bg-opacity-10 p-1 text-gray-100"
                  />
                ) : (
                  tsumo.tsumo
                )}
              </td>
              <td className="p-3">{formattedDate(tsumo.createdAt)}</td>
              <td className="space-x-2 p-3">
                {editId === tsumo.id ? (
                  <>
                    <button
                      onClick={() => handleSave(tsumo.id)}
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
                      onClick={() => handleEdit(tsumo)}
                      className="rounded bg-blue-600 px-2 py-1 text-white"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tsumo.id)}
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

export default TsumoLogList;
