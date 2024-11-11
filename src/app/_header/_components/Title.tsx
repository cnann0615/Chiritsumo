import Link from "next/link";
import React from "react";
import { TbMountain } from "react-icons/tb";

const Title = () => {
  return (
    <div>
      <Link href="/" className="flex items-center gap-2">
        <TbMountain size={35} data-testid="icon" />
        <span className="text-3xl font-bold">
          ちり
          <span className="text-pink-500">つも</span>
        </span>
      </Link>
    </div>
  );
};

export default Title;
