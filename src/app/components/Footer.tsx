import Link from "next/link";
import React from "react";
import { AiOutlineHome, AiOutlineUnorderedList } from "react-icons/ai";
import { BsBookmarkHeart } from "react-icons/bs";
import { getServerAuthSession } from "~/server/auth";

const Footer = async () => {
  const session = await getServerAuthSession();

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gray-800 text-white sm:relative sm:px-[4%] sm:py-6">
      {/* モバイルメニュー */}
      {session && (
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
              href="/tsumoManagement"
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
      )}
      <div className="container mx-auto hidden text-center sm:block">
        {/* コピーライト */}
        <div className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} ちりつも. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
