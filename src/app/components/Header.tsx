import Link from "next/link";
import React from "react";
import { IoIosLogOut } from "react-icons/io";
import { TbMountain } from "react-icons/tb";
import { AiOutlineHome, AiOutlineUnorderedList } from "react-icons/ai";
import { BsBookmarkHeart } from "react-icons/bs";
import Image from "next/image";
import { getServerAuthSession } from "~/server/auth";

const Header = async () => {
  const session = await getServerAuthSession();

  return (
    <header className="fixed left-0 top-0 w-full bg-gray-800 px-[4%] text-white">
      <nav className="mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          {/* タイトル */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <TbMountain size={35} data-testid="icon" />
              <span className="text-3xl font-bold">
                ちり
                <span className="text-pink-500">つも</span>
              </span>
            </Link>
          </div>
          {session && (
            <ul className="hidden gap-6 sm:flex">
              <li>
                <Link
                  href="/"
                  className="flex items-center gap-2 hover:text-pink-300"
                >
                  <AiOutlineHome size={20} />
                  ホーム
                </Link>
              </li>
              <li>
                <Link
                  href="/tsumoManagement"
                  className="flex items-center gap-2 hover:text-pink-300"
                >
                  <AiOutlineUnorderedList size={20} />
                  つも管理
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
          )}
        </div>

        {/* ログイン情報 */}
        {session && (
          <div className="flex items-center gap-4">
            <Image
              src={session.user.image!}
              alt="User Image"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="hidden font-medium sm:block">
              {session.user.name}
            </span>
            <Link href="/api/auth/signout" className="hover:text-gray-300">
              <IoIosLogOut size={25} />
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
