import React from "react";

const Button = ({ text, pending }: { text: string; pending: boolean }) => {
  return (
    <button className="w-full rounded bg-purple-800 px-4 py-2 font-bold text-white hover:bg-purple-600">
      {pending ? "処理中" : text}
    </button>
  );
};

export default Button;
