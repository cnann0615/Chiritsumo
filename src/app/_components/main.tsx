import React from "react";
import { getServerAuthSession } from "~/server/auth";

const main = async () => {
  const session = await getServerAuthSession();

  return <div>{session && session.user.name}のページ</div>;
};

export default main;
