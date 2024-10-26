import React from "react";
import Main from "./Main";
import { getServerAuthSession } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";

const SignIn = async () => {
  const session = await getServerAuthSession();
  return (
    <div className="min-h-[calc(100vh-64px)]">
      <p>サーバーでセッション取得：{session?.user.name}</p>
      <HydrateClient>
        <Main />
      </HydrateClient>
    </div>
  );
};

export default SignIn;
