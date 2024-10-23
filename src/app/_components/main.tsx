import Link from "next/link";
import React from "react";
import { getServerAuthSession } from "~/server/auth";

const Main = async () => {
  const session = await getServerAuthSession();

  return (
    <div>
      <div>{session!.user.name}のメインページ</div>
    </div>
  );
};

export default Main;
