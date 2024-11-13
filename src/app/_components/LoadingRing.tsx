import React from "react";

const LoadingRing = () => {
  return (
    <div className="flex justify-center" aria-label="読み込み中">
      <div className="mt-3 h-20 w-20 animate-spin rounded-full border-4 border-pink-500 border-t-transparent sm:mt-4 sm:h-28 sm:w-28"></div>
    </div>
  );
};

export default LoadingRing;
