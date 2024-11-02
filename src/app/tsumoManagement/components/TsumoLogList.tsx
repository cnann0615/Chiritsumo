"use client";
import { TsumoLog } from "@prisma/client";
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

const TsumoLogList = () => {
  const { data: tsumoList, isLoading } = api.tsumoLog.read.useQuery();
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

  const updateTsumoLog = api.tsumoLog.update.useMutation({
    onSuccess: async () => {
      updateTsumoBalance.mutate({ tsumo: -preEditData.tsumo });
      updateTsumoBalance.mutate({ tsumo: Number(editData.tsumo) });
      await utils.tsumoBalance.read.invalidate();
      await utils.tsumoLog.read.invalidate();
      setEditId(null);
    },
  });

  const deleteTsumoLog = api.tsumoLog.delete.useMutation({
    onSuccess: async (tsumo) => {
      updateTsumoBalance.mutate({ tsumo: -tsumo.tsumo });
      await utils.tsumoBalance.read.invalidate();
      await utils.tsumoLog.read.invalidate();
    },
  });
  const updateTsumoBalance = api.tsumoBalance.update.useMutation();

  const handleEdit = (tsumo: TsumoLog) => {
    setEditId(tsumo.id);
    setPreEditData({ title: tsumo.title, tsumo: Number(tsumo.tsumo) });
    setEditData({ title: tsumo.title, tsumo: tsumo.tsumo.toString() });
  };

  const handleSave = async (id: string) => {
    const tsumoValue = editData.tsumo === "" ? 0 : Number(editData.tsumo);
    updateTsumoLog.mutate({
      id,
      title: editData.title,
      tsumo: tsumoValue,
    });
  };

  const handleCancel = () => {
    setEditId(null);
  };

  const handleDelete = async (id: string) => {
    window.confirm("本当に削除しますか？") && deleteTsumoLog.mutate({ id });
  };

  return (
    <div>
      {isLoading ? (
        "ログ取得中..."
      ) : (
        <div className="mb-20 overflow-x-auto">
          <h1 className="mb-4 text-xl font-bold text-gray-100 sm:text-2xl">
            ログ
          </h1>
          {tsumoList!.length > 0 ? (
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
                {tsumoList!.map((tsumo) => (
                  <tr
                    key={tsumo.id}
                    className="border-b border-gray-500 bg-black bg-opacity-30"
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
                          className="w-full rounded border bg-black bg-opacity-10 p-1 text-gray-100"
                          placeholder="タイトル"
                        />
                      ) : (
                        <span className="block sm:table-cell">
                          {tsumo.title}
                        </span>
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
                          className="w-full rounded border bg-black bg-opacity-10 p-1 text-gray-100"
                          placeholder="値段"
                        />
                      ) : (
                        <span className="block sm:table-cell">
                          {tsumo.tsumo}
                        </span>
                      )}
                    </td>
                    <td className="p-3">{formattedDate(tsumo.createdAt)}</td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-2">
                        {editId === tsumo.id ? (
                          <>
                            <Button
                              text={"Save"}
                              size={"small"}
                              bgColor={"green"}
                              pending={updateTsumoLog.isPending}
                              onClick={() => handleSave(tsumo.id)}
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
                              onClick={() => handleEdit(tsumo)}
                            />
                            <Button
                              text={"Delete"}
                              size={"small"}
                              bgColor={"gray"}
                              pending={deleteTsumoLog.isPending}
                              onClick={() => handleDelete(tsumo.id)}
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

export default TsumoLogList;
