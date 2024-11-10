import React from "react";

const Button = ({
  text,
  size = "medium",
  bgColor,
  pending,
  onClick,
}: {
  text: string;
  size?: "xSmall" | "small" | "medium" | "large";
  bgColor: "green" | "gray" | "pink";
  pending: boolean;
  onClick?: () => void;
}) => {
  const sizeClasses = {
    xSmall: "h-[30px] min-w-[50px] ",
    small: "h-[30px] min-w-[100px] ",
    medium: "h-[50px] min-w-[100px]",
    large: "h-[50px] w-full",
  };

  const bgColorClasses = {
    green: "bg-green-500 hover:bg-green-700",
    gray: "bg-gray-300 hover:bg-gray-400",
    pink: "bg-pink-500 hover:bg-pink-700",
  };

  return (
    <div className="relative">
      {/* pending が true の時にオーバーレイを表示 */}
      {pending && (
        <div className="fixed inset-0 z-10 bg-black opacity-50"></div>
      )}

      <button
        className={`flex items-center justify-center rounded-md px-4 py-2 font-bold text-white opacity-90 ${
          sizeClasses[size]
        } ${bgColorClasses[bgColor]}`}
        onClick={onClick}
        disabled={pending}
      >
        {pending ? (
          <div className="h-4 w-4 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
        ) : (
          text
        )}
      </button>
    </div>
  );
};

export default Button;
