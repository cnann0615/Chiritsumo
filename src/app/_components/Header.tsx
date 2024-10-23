import Link from "next/link";
import React from "react";
import { IoIosLogOut } from "react-icons/io";
import Image from "next/image";
import { getServerAuthSession } from "~/server/auth";
import { MdOutlineTaskAlt } from "react-icons/md";

const Header = async () => {
  const session = await getServerAuthSession();

  return (
    <header className="bg-gray-800 p-4 text-white">
      <nav className="container mx-auto flex items-center justify-between">
        {/* 左端のタイトル */}
        <div className="flex gap-3">
          <MdOutlineTaskAlt size={35} data-testid="icon" />
          <div className="text-3xl font-bold">Task Manager</div>
        </div>

        {/* 右端のログイン情報 */}
        {session && (
          <div className="flex items-center space-x-4">
            {/* ログインアイコン */}
            <div>
              <Image
                src={session.user.image!}
                alt="User Image"
                width={32}
                height={32}
                className="rounded-full"
              />
            </div>

            {/* ログイン名 */}
            <span>{session!.user.name}</span>

            {/* ログアウトボタン */}
            <Link href={"/api/auth/signout"}>
              <IoIosLogOut size={25} />
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
