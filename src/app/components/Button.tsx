import React from "react";

const Button = ({ text, pending }: { text: string; pending: boolean }) => {
  return (
    <button className="h-[50px] w-full rounded bg-white bg-opacity-10 px-4 py-2 font-bold text-white hover:bg-purple-900">
      {pending ? "処理中.." : text}
    </button>
  );
};

export default Button;
