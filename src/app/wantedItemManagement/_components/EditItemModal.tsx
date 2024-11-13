import React from "react";
import Button from "~/app/_components/Button";
import EditModal from "~/app/_components/EditModal";

const EditItemModal = ({
  isOpen,
  onClose,
  editData,
  setEditData,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  editData: { name: string; price: string; url: string };
  setEditData: React.Dispatch<
    React.SetStateAction<{ name: string; price: string; url: string }>
  >;
  onSave: () => Promise<void>;
}) => {
  if (!isOpen) return null;

  return (
    <EditModal isOpen={isOpen} onClose={onClose}>
      <h2 className="mb-4 text-lg font-bold">アイテムを編集</h2>
      <div className="mb-4">
        <label className="block text-gray-400">商品名</label>
        <input
          type="text"
          value={editData.name}
          onChange={(e) =>
            setEditData((prev) => ({ ...prev, name: e.target.value }))
          }
          className="w-full rounded border bg-black bg-opacity-10 px-2 py-1 text-gray-100"
          placeholder="商品名"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-400">価格</label>
        <input
          type="number"
          value={editData.price}
          onChange={(e) =>
            setEditData((prev) => ({ ...prev, price: e.target.value }))
          }
          className="w-full rounded border bg-black bg-opacity-10 px-2 py-1 text-gray-100"
          placeholder="価格"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-400">URL</label>
        <input
          type="url"
          value={editData.url}
          onChange={(e) =>
            setEditData((prev) => ({ ...prev, url: e.target.value }))
          }
          className="w-full rounded border bg-black bg-opacity-10 px-2 py-1 text-gray-100"
          placeholder="URL"
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button
          text={"Save"}
          size={"small"}
          bgColor={"green"}
          onClick={onSave}
        />
        <Button
          text={"Cancel"}
          size={"small"}
          bgColor={"gray"}
          onClick={onClose}
        />
      </div>
    </EditModal>
  );
};

export default EditItemModal;
