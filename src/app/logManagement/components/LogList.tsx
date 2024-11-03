"use client";
import { Log } from "@prisma/client";
import React, { useState } from "react";
import { api } from "~/trpc/react";

import Button from "~/app/components/Button";

// 日付フォーマット用関数
const formattedDate = (date: Date): string => {
  return date.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ログリストコンポーネント
const LogList = () => {
  // ログデータ取得
  const { data: logList, isLoading } = api.log.read.useQuery();
  // キャッシュ更新用
  const utils = api.useUtils();
  // 編集中ログidの管理
  const [editId, setEditId] = useState<string | null>(null);
  // 編集するログの編集前の状態を管理
  const [preEditData, setPreEditData] = useState<{
    title: string;
    price: number;
  }>({
    title: "",
    price: 0,
  });
  // 編集中のログの内容を管理
  const [editData, setEditData] = useState<{ title: string; price: string }>({
    title: "",
    price: "",
  });
  // 削除中のログのidを管理
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // ミューテーション定義
  const updateBalance = api.balance.update.useMutation();

  const updateLog = api.log.update.useMutation({
    onSuccess: async () => {
      // 編集前のログの値段を残高から引いて、編集後の値段を足す
      updateBalance.mutate({ balance: -preEditData.price });
      updateBalance.mutate({ balance: Number(editData.price) });
      await utils.balance.read.invalidate();
      await utils.log.read.invalidate();
      setEditId(null);
    },
  });

  const deleteLog = api.log.delete.useMutation({
    onSuccess: async (log) => {
      // 削除対象のログの値段を残高から引く
      updateBalance.mutate({ balance: -log.price });
      await utils.balance.read.invalidate();
      await utils.log.read.invalidate();
      setDeleteId(null);
    },
  });

  // イベント
  const handleEdit = (log: Log) => {
    setEditId(log.id);
    setPreEditData({ title: log.title, price: Number(log.price) });
    setEditData({ title: log.title, price: log.price.toString() });
  };

  const handleSave = async (id: string) => {
    // string → numberに変換
    const _price = editData.price === "" ? 0 : Number(editData.price);
    updateLog.mutate({
      id,
      title: editData.title,
      price: _price,
    });
  };

  const handleCancel = () => {
    setEditId(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("本当に削除しますか？")) {
      setDeleteId(id);
      deleteLog.mutate({ id });
    }
  };

  return (
    <div>
      {isLoading ? (
        "ログ取得中..."
      ) : (
        <div className="overflow-x-auto">
          <h1 className="mb-4 text-xl font-bold text-gray-100 sm:text-2xl">
            ログ
          </h1>
          {logList!.length > 0 ? (
            <table className="w-full border-collapse text-left text-sm sm:text-base">
              <thead>
                <tr className="bg-black bg-opacity-50">
                  <th className="p-3 font-semibold text-gray-200">タイトル</th>
                  <th className="p-3 font-semibold text-gray-200">値段</th>
                  <th className="p-3 font-semibold text-gray-200">日時</th>
                  <th className="p-3 font-semibold text-gray-200">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody>
                {logList!.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-gray-500 bg-black bg-opacity-30"
                  >
                    <td className="p-3">
                      {editId === log.id ? (
                        <input
                          type="text"
                          value={editData.title}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              title: e.target.value,
                            }))
                          }
                          className="w-full rounded border bg-black bg-opacity-10 p-1 text-gray-100"
                          placeholder="タイトル"
                        />
                      ) : (
                        <span className="block sm:table-cell">{log.title}</span>
                      )}
                    </td>
                    <td className="p-3">
                      {editId === log.id ? (
                        <input
                          type="number"
                          value={editData.price}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              price: e.target.value,
                            }))
                          }
                          className="w-full rounded border bg-black bg-opacity-10 p-1 text-gray-100"
                          placeholder="値段"
                        />
                      ) : (
                        <span className="block sm:table-cell">{log.price}</span>
                      )}
                    </td>
                    <td className="p-3">{formattedDate(log.createdAt)}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        {editId === log.id ? (
                          <>
                            <Button
                              text={"Save"}
                              size={"small"}
                              bgColor={"green"}
                              pending={updateLog.isPending}
                              onClick={() => handleSave(log.id)}
                            />

                            <Button
                              text={"Cancel"}
                              size={"small"}
                              bgColor={"gray"}
                              onClick={() => handleCancel()}
                              pending={false}
                            />
                          </>
                        ) : (
                          <>
                            <Button
                              text={"Edit"}
                              size={"small"}
                              bgColor={"pink"}
                              pending={false}
                              onClick={() => handleEdit(log)}
                            />
                            <Button
                              text={"Delete"}
                              size={"small"}
                              bgColor={"gray"}
                              pending={deleteId == log.id}
                              onClick={() => handleDelete(log.id)}
                            />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-gray-500">ログがありません。</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LogList;
