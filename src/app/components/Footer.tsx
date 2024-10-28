import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 px-[4%] text-white py-6">
      <div className="container mx-auto flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        
        {/* ナビゲーション */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-8">
          <Link href="/" className="hover:text-gray-400">
            ホーム
          </Link>
          <Link href="/tsumoManagement" className="hover:text-gray-400">
            つも管理
          </Link>
          <Link href="/wantedItemManagement" className="hover:text-gray-400">
            欲しい物リスト
          </Link>
        </div>

        {/* 利用規約やプライバシーポリシー */}
        <div className="flex flex-col items-center gap-4 text-sm text-gray-400 sm:flex-row sm:gap-8">
          <Link href="/terms" className="hover:text-white">
            利用規約
          </Link>
          <Link href="/privacy" className="hover:text-white">
            プライバシーポリシー
          </Link>
        </div>
      </div>

      {/* コピーライト */}
      <div className="mt-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} ちりつも. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;