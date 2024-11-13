import React from "react";
import { Log } from "@prisma/client";
import Row from "./Row";

const Table = ({
  logs,
  onEdit,
  onDelete,
}: {
  logs: Log[];
  onEdit: (log: Log) => void;
  onDelete: (id: string) => Promise<void>;
}) => (
  <div className="overflow-x-auto">
    {logs.length > 0 ? (
      <table className="w-full border-collapse text-left text-sm">
        <thead>
          <tr className="bg-black bg-opacity-50">
            <th className="w-1/2 p-2 font-semibold text-gray-200">タイトル</th>
            <th className="w-1/6 p-2 font-semibold text-gray-200">値段</th>
            <th className="w-1/4 p-2 font-semibold text-gray-200">日時</th>
            <th className="p-2 font-semibold text-gray-200">アクション</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <Row key={log.id} log={log} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    ) : (
      <p className="text-center text-gray-500">ログがありません。</p>
    )}
  </div>
);

export default Table;
