import Link from "next/link";
import React from "react";
import { IoIosLogOut } from "react-icons/io";
import Image from "next/image";
import { getServerAuthSession } from "~/server/auth";
import { TbMountain } from "react-icons/tb";

const Header = async () => {
  const session = await getServerAuthSession();

  return (
    <header className="bg-gray-800 px-[4%] text-white">
      <nav className="mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          {/* タイトル */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <TbMountain size={35} data-testid="icon" />
              <span className="text-3xl font-bold">ちりつも</span>
            </Link>
          </div>
          {/* メニュー */}
          <ul className="flex gap-6">
            <li>
              <Link href="/" className="hover:underline">
                ホーム
              </Link>
            </li>
            <li>
              <Link href="/tsumoManagement" className="hover:underline">
                つも管理
              </Link>
            </li>
            <li>
              <Link href="/wantedItemManagement" className="hover:underline">
                欲しい物リスト
              </Link>
            </li>
          </ul>
        </div>

        {/* ログイン情報 */}
        {session && (
          <div className="flex items-center gap-4">
            {/* ログインアイコン */}
            <Image
              src={session.user.image!}
              alt="User Image"
              width={32}
              height={32}
              className="rounded-full"
            />

            {/* ログイン名 */}
            <span className="font-medium">{session.user.name}</span>

            {/* ログアウトボタン */}
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
