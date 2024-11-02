import React from "react";

const Button = ({
  text,
  size = "medium",
  bgColor,
  pending,
  onClick,
}: {
  text: string;
  size?: "small" | "medium" | "large";
  bgColor: "green" | "gray" | "pink"; // 使用する色を指定
  pending: boolean;
  onClick?: () => void;
}) => {
  const sizeClasses = {
    small: "h-[30px] min-w-[100px] ",
    medium: "h-[50px] min-w-[100px]",
    large: "h-[50px] w-full",
  };

  const bgColorClasses = {
    green: "bg-green-500 hover:bg-green-700",
    gray: "bg-gray-500 hover:bg-gray-700",
    pink: "bg-pink-500 hover:bg-pink-700",
  };

  return (
    <button
      className={`flex items-center justify-center rounded-md px-4 py-2 font-bold text-white opacity-90 ${
        sizeClasses[size]
      } ${bgColorClasses[bgColor]}`}
      onClick={onClick}
      disabled={pending}
    >
      {pending ? "処理中.." : text}
    </button>
  );
};

export default Button;
