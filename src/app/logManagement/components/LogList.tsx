"use client";
import { Log } from "@prisma/client";
import React, { useState } from "react";
import { api } from "~/trpc/react";
import Button from "~/app/components/Button";
import EditModal from "../../components/EditModal";

const formattedDate = (date: Date): string => {
  return date
    .toLocaleString("ja-JP", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(/^20/, "");
};

const LogList = () => {
  const utils = api.useUtils();
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<{ title: string; price: string }>({
    title: "",
    price: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const logsPerPage = 15;

  // フェッチしてページネーション用に切り分け
  const { data: logList, isLoading } = api.log.read.useQuery();
  const paginatedLogs = logList
    ? logList.slice((currentPage - 1) * logsPerPage, currentPage * logsPerPage)
    : [];

  const totalPages = logList ? Math.ceil(logList.length / logsPerPage) : 1;

  const updateLog = api.log.update.useMutation({
    onSuccess: async () => {
      await utils.balance.read.invalidate();
      await utils.log.read.invalidate();
      setEditId(null);
    },
  });

  const deleteLog = api.log.delete.useMutation({
    onSuccess: async () => {
      await utils.balance.read.invalidate();
      await utils.log.read.invalidate();
    },
  });

  const handleEdit = (log: Log) => {
    setEditId(log.id);
    setEditData({ title: log.title, price: log.price.toString() });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (editId) {
      const _price = editData.price === "" ? 0 : Number(editData.price);

      // 楽観的更新
      utils.log.read.setData(undefined, (oldData) => {
        if (!oldData) return oldData;
        return oldData.map((log) =>
          log.id === editId
            ? { ...log, title: editData.title, price: _price }
            : log,
        );
      });

      // 先にモーダルを閉じる
      setIsModalOpen(false);

      try {
        updateLog.mutate({
          id: editId,
          title: editData.title,
          price: _price,
        });
      } catch (error) {
        console.error("Error updating balance or creating log:", error);
        window.alert(
          "データの更新中に問題が発生しました。もう一度お試しください。",
        );
        utils.log.read.invalidate(); // エラーが出た場合、キャッシュを無効化してリセット
      }
    }
  };

  const handleCancel = () => {
    setEditId(null);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("本当に削除しますか？")) {
      // 楽観的にUIを更新して削除を反映
      utils.log.read.setData(undefined, (oldData) => {
        if (!oldData) return oldData;
        return oldData.filter((log) => log.id !== id);
      });

      try {
        deleteLog.mutate({ id });
      } catch (error) {
        console.error("Error updating balance or creating log:", error);
        window.alert(
          "データの削除中に問題が発生しました。もう一度お試しください。",
        );
        utils.log.read.invalidate(); // エラーが出た場合、キャッシュを無効化してリセット
      }
    }
  };

  const handlePageClick = (pageNumber: number) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentPage(pageNumber);
  };

  return (
    <div>
      <h1 className="mb-4 pl-1 text-xl font-bold text-gray-100 sm:text-2xl">
        ログ
      </h1>
      {isLoading ? (
        <div className="flex justify-center" aria-label="読み込み中">
          <div className="mt-3 h-20 w-20 animate-spin rounded-full border-4 border-pink-500 border-t-transparent sm:mt-4 sm:h-28 sm:w-28"></div>
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto">
            {paginatedLogs.length > 0 ? (
              <table className="w-full border-collapse text-left text-sm sm:text-base">
                <thead>
                  <tr className="bg-black bg-opacity-50">
                    <th className="w-1/2 p-2 font-semibold text-gray-200 sm:p-3">
                      タイトル
                    </th>
                    <th className="w-1/6 p-2 font-semibold text-gray-200 sm:p-3">
                      値段
                    </th>
                    <th className="w-1/4 p-2 font-semibold text-gray-200 sm:p-3">
                      日時
                    </th>
                    <th className="p-2 font-semibold text-gray-200 sm:p-3">
                      アクション
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLogs.map((log) => (
                    <tr
                      key={log.id}
                      className="border-b border-gray-500 bg-black bg-opacity-30"
                    >
                      <td className="p-2 sm:p-3">{log.title}</td>
                      <td className="p-2 sm:p-3">{log.price}</td>
                      <td className="p-2 sm:p-3">
                        {formattedDate(log.createdAt)}
                      </td>
                      <td className="p-2 sm:p-3">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            text={"✏️"}
                            size={"xSmall"}
                            bgColor={"pink"}
                            pending={false}
                            onClick={() => handleEdit(log)}
                          />
                          <Button
                            text={"🗑️"}
                            size={"xSmall"}
                            bgColor={"gray"}
                            pending={false}
                            onClick={() => handleDelete(log.id)}
                          />
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
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              <button
                className="px-3 py-1 text-gray-500 hover:text-gray-300"
                onClick={() => handlePageClick(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ＜ Back
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  className={`px-3 py-1 ${
                    currentPage === index + 1
                      ? "bg-pink-500 text-white"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                  onClick={() => handlePageClick(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className="px-3 py-1 text-gray-500 hover:text-gray-300"
                onClick={() => handlePageClick(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next ＞
              </button>
            </div>
          )}
        </div>
      )}

      {/* 編集モーダル */}
      <EditModal isOpen={isModalOpen} onClose={handleCancel}>
        <h2 className="mb-4 text-lg font-bold">編集</h2>
        <div className="mb-4">
          <label className="block text-gray-400">タイトル</label>
          <input
            type="text"
            value={editData.title}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full rounded border bg-black bg-opacity-10 p-2 text-gray-100"
            placeholder="タイトル"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-400">値段</label>
          <input
            type="number"
            value={editData.price}
            onChange={(e) =>
              setEditData((prev) => ({ ...prev, price: e.target.value }))
            }
            className="w-full rounded border bg-black bg-opacity-10 p-2 text-gray-100"
            placeholder="値段"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            text={"Save"}
            size={"small"}
            bgColor={"green"}
            pending={false}
            onClick={handleSave}
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

export default LogList;
