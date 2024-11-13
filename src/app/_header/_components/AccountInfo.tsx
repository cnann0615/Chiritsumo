import React from "react";
import Image from "next/image";
import { Session } from "next-auth";
import LogOutLink from "./LogOutLink";

const AccountInfo = ({ session }: { session: Session }) => {
  return (
    <div className="flex items-center gap-4">
      {session.user.image ? (
        // Googleアカウントの画像を表示
        <Image
          src={session.user.image}
          alt="User Image"
          width={32}
          height={32}
          className="rounded-full"
        />
      ) : (
        ""
      )}
      <span className="hidden font-medium sm:block">{session.user.name}</span>
      <LogOutLink />
    </div>
  );
};

export default AccountInfo;
