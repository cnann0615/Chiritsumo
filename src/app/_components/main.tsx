import React from "react";
import { getServerAuthSession } from "~/server/auth";

const main = async () => {
  const session = await getServerAuthSession();

  return <div>{session!.user.name}のメインページ</div>;
};

export default main;
