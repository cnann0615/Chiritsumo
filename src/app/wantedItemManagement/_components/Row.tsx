import React from "react";
import Button from "~/app/_components/Button";
import { WantedItem } from "@prisma/client";

const Row = ({
  item,
  onEdit,
  onDelete,
}: {
  item: WantedItem;
  onEdit: (item: WantedItem) => void;
  onDelete: (id: string) => Promise<void>;
}) => (
  <article className="mb-4 flex items-center justify-between gap-4 rounded border border-gray-500 bg-gray-900 p-4 shadow-xl">
    <div className="w-full flex-1">
      <div>
        <div className="flex items-end gap-3">
          <h3 className="text-lg font-semibold text-gray-100">{item.name}</h3>
          <p className="text-sm text-gray-300 sm:text-base">
            Price: ¥{item.price}
          </p>
        </div>
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            詳細を見る
          </a>
        )}
      </div>
    </div>
    <div>
      <div className="flex-col space-y-2">
        <Button
          text={"✏️"}
          size={"xSmall"}
          bgColor={"pink"}
          onClick={() => onEdit(item)}
        />
        <Button
          text={"🗑️"}
          size={"xSmall"}
          bgColor={"gray"}
          onClick={() => onDelete(item.id)}
        />
      </div>
    </div>
  </article>
);

export default Row;
