import Link from "next/link";
import React from "react";
import { AiOutlineHome, AiOutlineUnorderedList } from "react-icons/ai";
import { BsBookmarkHeart } from "react-icons/bs";

const Menu = () => {
  return (
    <ul className="flex justify-around gap-4 bg-gray-700 py-2 pt-2 text-sm sm:hidden">
      <li className="flex flex-col items-center">
        <Link
          href="/"
          className="flex flex-col items-center text-white hover:text-pink-500"
        >
          <AiOutlineHome size={22} />
          <span>ホーム</span>
        </Link>
      </li>
      <li className="flex flex-col items-center">
        <Link
          href="/logManagement"
          className="flex flex-col items-center text-white hover:text-pink-500"
        >
          <AiOutlineUnorderedList size={22} />
          <span>ログ</span>
        </Link>
      </li>
      <li className="flex flex-col items-center">
        <Link
          href="/wantedItemManagement"
          className="flex flex-col items-center text-white hover:text-pink-500"
        >
          <BsBookmarkHeart size={22} />
          <span>欲しい物</span>
        </Link>
      </li>
    </ul>
  );
};

export default Menu;
