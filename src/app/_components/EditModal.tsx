import React, { ReactNode } from "react";

const EditModal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 sm:p-6">
      <div className="relative w-full max-w-sm rounded-lg bg-gray-800 p-4 text-white shadow-lg sm:max-w-md sm:p-6 md:max-w-lg lg:max-w-xl">
        <button
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-100"
          onClick={onClose}
        >
          ✖️
        </button>
        {children}
      </div>
    </div>
  );
};

export default EditModal;
