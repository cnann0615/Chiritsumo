import React from "react";
import { getServerAuthSession } from "~/server/auth";
import Menu from "./_components/Menu";
import CopyRight from "./_components/CopyRight";

const Footer = async () => {
  const session = await getServerAuthSession();

  return (
    <footer className="fixed bottom-0 left-0 w-full bg-gray-800 text-white sm:relative sm:px-[4%] sm:py-6">
      {/* モバイルメニュー */}
      {session && (
        // sm以下の時にメニューを表示。sm以上の時はヘッダーに表示。
        <Menu />
      )}
      <CopyRight />
    </footer>
  );
};

export default Footer;
