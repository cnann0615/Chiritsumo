"use client";
import { Log } from "@prisma/client";
import React, { useState } from "react";
import { api } from "~/trpc/react";

import Button from "~/app/components/Button";

const formattedDate = (date: Date): string => {
  return date.toLocaleString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const LogList = () => {
  const { data: logList, isLoading } = api.log.read.useQuery();
  const utils = api.useUtils();
  const [editId, setEditId] = useState<string | null>(null);
  const [preEditData, setPreEditData] = useState<{
    title: string;
    balance: number;
  }>({
    title: "",
    balance: 0,
  });
  const [editData, setEditData] = useState<{ title: string; balance: string }>({
    title: "",
    balance: "",
  });

  const updateLog = api.log.update.useMutation({
    onSuccess: async () => {
      updateBalance.mutate({ balance: -preEditData.balance });
      updateBalance.mutate({ balance: Number(editData.balance) });
      await utils.balance.read.invalidate();
      await utils.log.read.invalidate();
      setEditId(null);
    },
  });

  const deleteLog = api.log.delete.useMutation({
    onSuccess: async (balance) => {
      updateBalance.mutate({ balance: -balance.balance });
      await utils.balance.read.invalidate();
      await utils.log.read.invalidate();
    },
  });
  const updateBalance = api.balance.update.useMutation();

  const handleEdit = (balance: Log) => {
    setEditId(balance.id);
    setPreEditData({ title: balance.title, balance: Number(balance.balance) });
    setEditData({ title: balance.title, balance: balance.balance.toString() });
  };

  const handleSave = async (id: string) => {
    const balanceValue = editData.balance === "" ? 0 : Number(editData.balance);
    updateLog.mutate({
      id,
      title: editData.title,
      balance: balanceValue,
    });
  };

  const handleCancel = () => {
    setEditId(null);
  };

  const handleDelete = async (id: string) => {
    window.confirm("本当に削除しますか？") && deleteLog.mutate({ id });
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
                {logList!.map((balance) => (
                  <tr
                    key={balance.id}
                    className="border-b border-gray-500 bg-black bg-opacity-30"
                  >
                    <td className="p-3">
                      {editId === balance.id ? (
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
                        <span className="block sm:table-cell">
                          {balance.title}
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      {editId === balance.id ? (
                        <input
                          type="number"
                          value={editData.balance}
                          onChange={(e) =>
                            setEditData((prev) => ({
                              ...prev,
                              balance: e.target.value,
                            }))
                          }
                          className="w-full rounded border bg-black bg-opacity-10 p-1 text-gray-100"
                          placeholder="値段"
                        />
                      ) : (
                        <span className="block sm:table-cell">
                          {balance.balance}
                        </span>
                      )}
                    </td>
                    <td className="p-3">{formattedDate(balance.createdAt)}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        {editId === balance.id ? (
                          <>
                            <Button
                              text={"Save"}
                              size={"small"}
                              bgColor={"green"}
                              pending={updateLog.isPending}
                              onClick={() => handleSave(balance.id)}
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
                              onClick={() => handleEdit(balance)}
                            />
                            <Button
                              text={"Delete"}
                              size={"small"}
                              bgColor={"gray"}
                              pending={deleteLog.isPending}
                              onClick={() => handleDelete(balance.id)}
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
