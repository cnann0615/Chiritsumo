import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageClick,
}: {
  currentPage: number;
  totalPages: number;
  onPageClick: React.Dispatch<React.SetStateAction<number>>;
}) => (
  <div className="mt-4 flex justify-center gap-2">
    <button
      onClick={() => onPageClick(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-3 py-1 text-gray-500 hover:text-gray-300"
    >
      ＜ Back
    </button>
    {Array.from({ length: totalPages }, (_, index) => (
      <button
        key={index}
        onClick={() => onPageClick(index + 1)}
        className={`px-3 py-1 ${
          currentPage === index + 1
            ? "bg-pink-500 text-white"
            : "text-gray-500 hover:text-gray-300"
        }`}
      >
        {index + 1}
      </button>
    ))}
    <button
      onClick={() => onPageClick(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-3 py-1 text-gray-500 hover:text-gray-300"
    >
      Next ＞
    </button>
  </div>
);

export default Pagination;
