import Link from "next/link";
import React from "react";
import { AiOutlineHome, AiOutlineUnorderedList } from "react-icons/ai";
import { BsBookmarkHeart } from "react-icons/bs";

const Menu = () => {
  return (
    <ul className="hidden gap-6 sm:flex">
      <li>
        <Link href="/" className="flex items-center gap-2 hover:text-pink-300">
          <AiOutlineHome size={20} />
          ホーム
        </Link>
      </li>
      <li>
        <Link
          href="/logManagement"
          className="flex items-center gap-2 hover:text-pink-300"
        >
          <AiOutlineUnorderedList size={20} />
          ログ
        </Link>
      </li>
      <li>
        <Link
          href="/wantedItemManagement"
          className="flex items-center gap-2 hover:text-pink-300"
        >
          <BsBookmarkHeart size={20} />
          欲しい物リスト
        </Link>
      </li>
    </ul>
  );
};

export default Menu;
