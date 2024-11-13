"use client";
import React, { useState } from "react";
import { api } from "~/trpc/react";
import EditLogModal from "./EditLogModal";
import Table from "./Table";
import Pagination from "./Pagination";
import { Log } from "@prisma/client";
import LoadingRing from "~/app/_components/LoadingRing";

const LogList = () => {
  // キャッシュ更新用
  const utils = api.useUtils();

  // ログ編集用
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ title: "", price: "" });

  // モーダルの開閉管理用
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ページネーション関連
  const [currentPage, setCurrentPage] = useState(1);
  const logsPerPage = 15;
  const { data: logList, isLoading } = api.log.read.useQuery();
  const paginatedLogs = logList
    ? logList.slice((currentPage - 1) * logsPerPage, currentPage * logsPerPage)
    : [];
  const totalPages = logList ? Math.ceil(logList.length / logsPerPage) : 1;

  // ミューテーション定義
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

  // ハンドラ

  // ログ編集開始
  const handleEdit = (log: Log) => {
    setEditId(log.id);
    setEditData({ title: log.title, price: log.price.toString() });
    setIsModalOpen(true);
  };

  // 編集内容保存
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
        utils.log.read.invalidate(); // エラーが出た場合、キャッシュを無効化（再取得）してリセット
      }
    }
  };

  // 編集キャンセル
  const handleCancel = () => {
    setEditId(null);
    setIsModalOpen(false);
  };

  // ログ削除
  const handleDelete = async (id: string) => {
    if (window.confirm("本当に削除しますか？")) {
      // 楽観的更新
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
        utils.log.read.invalidate(); // エラーが出た場合、キャッシュを無効化（再取得）してリセット
      }
    }
  };

  return (
    <div>
      {isLoading ? (
        <LoadingRing />
      ) : (
        <>
          <Table
            logs={paginatedLogs}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageClick={setCurrentPage}
          />
        </>
      )}
      <EditLogModal
        isOpen={isModalOpen}
        editData={editData}
        onClose={handleCancel}
        onSave={handleSave}
        setEditData={setEditData}
      />
    </div>
  );
};

export default LogList;
