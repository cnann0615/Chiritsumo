import Link from "next/link";
import React from "react";
import { getServerAuthSession } from "~/server/auth";

const main = async () => {
  const session = await getServerAuthSession();

  return (
    <div>
      <Link
        href={"/api/auth/signout"}
        className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
      >
        "Sign out"
      </Link>
      <div>{session!.user.name}のメインページ</div>
    </div>
  );
};

export default main;
