import React from "react";
import Button from "~/app/_components/Button";
import EditModal from "~/app/_components/EditModal";

const EditLogModal = ({
  isOpen,
  onClose,
  onSave,
  editData,
  setEditData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => Promise<void>;
  editData: {
    title: string;
    price: string;
  };
  setEditData: React.Dispatch<
    React.SetStateAction<{
      title: string;
      price: string;
    }>
  >;
}) => {
  if (!isOpen) return null;

  return (
    <EditModal isOpen={isOpen} onClose={onClose}>
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

export default EditLogModal;
