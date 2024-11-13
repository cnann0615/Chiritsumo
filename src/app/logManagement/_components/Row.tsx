import React from "react";
import Button from "~/app/_components/Button";
import { Log } from "@prisma/client";

// 日付フォーマット関数
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

const Row = ({
  log,
  onEdit,
  onDelete,
}: {
  log: Log;
  onEdit: (log: Log) => void;
  onDelete: (id: string) => Promise<void>;
}) => (
  <tr className="border-b border-gray-500 bg-black bg-opacity-30">
    <td className="px-4 text-base">{log.title}</td>
    <td className="px-4 text-base">{log.price}</td>
    <td className="px-4 text-base">{formattedDate(log.createdAt)}</td>
    <td className="p-2">
      <div className="flex flex-col gap-1 px-4">
        <Button
          text="✏️"
          size="xSmall"
          bgColor="pink"
          onClick={() => onEdit(log)}
        />
        <Button
          text="🗑️"
          size="xSmall"
          bgColor="gray"
          onClick={() => onDelete(log.id)}
        />
      </div>
    </td>
  </tr>
);

export default Row;
