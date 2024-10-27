import React from "react";

const Button = ({ text, pending }: { text: string; pending: boolean }) => {
  return (
    <button className="h-[50px] w-full rounded bg-pink-500 px-4 py-2 font-bold text-white opacity-90 hover:bg-pink-700">
      {pending ? "処理中.." : text}
    </button>
  );
};

export default Button;
